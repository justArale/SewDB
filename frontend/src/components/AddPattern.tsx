// AddPattern.tsx
import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import fileUploadService from "../service/file-upload.service";
import { AuthContext } from "../context/auth.context";
import axios from "axios";
import { extractPublicId } from "cloudinary-build-url";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  isAdmin: boolean;
}

interface Pattern {
  name: string;
  intendedFor: string;
  image: string;
  category: { name: string }[];
  sizes: { name: string }[];
  source: { name: string }[];
}

const AddPattern: React.FC<{ existingPattern?: Pattern }> = ({
  existingPattern,
}) => {
  const authContext = useContext(AuthContext);
  const user: User | null = authContext?.user ?? null;
  const { patternId } = useParams<{ patternId: string }>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorMessageMain, setErrorMessageMain] = useState<string>("");
  const [errorMessageIngredient, setErrorMessageIngredient] =
    useState<string>("");
  const [errorMessageInstruction, setErrorMessageInstruction] =
    useState<string>("");
  const [oldImageId, setOldImageId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageIsLoading, setImageIsLoading] = useState<boolean>(false);

  let navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [intendedFor, setIntendedFor] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [category, setCategory] = useState<string[]>([""]);
  const [sizes, setSizes] = useState<string[]>([""]);
  const [source, setSource] = useState<string[]>([""]);

  useEffect(() => {
    if (existingPattern) {
      setName(existingPattern.name);
      setIntendedFor(existingPattern.intendedFor);
      setImg(existingPattern.image);
      setCategory(
        existingPattern.category.map((cate: { name: string }) => cate.name)
      );
      setSizes(
        existingPattern.sizes.map((size: { name: string }) => size.name)
      );
      setSource(
        existingPattern.source.map((sour: { name: string }) => sour.name)
      );
    }
  }, [existingPattern]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    try {
      setImageIsLoading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("No file selected");
      }

      const file = event.target.files[0];
      const oldId = getOldImageId(img);
      setOldImageId(oldId);

      const fileData = new FormData();
      fileData.append("image", file);

      const fileUrl = await fileUploadService.uploadPatternImage(fileData);

      if (fileUrl) {
        if (fileUrl && typeof fileUrl === "object" && fileUrl.url) {
          setImg(fileUrl.url);
        } else {
          throw new Error("File upload failed");
        }
      } else {
        throw new Error("Response has the wrong type");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageIsLoading(false);
    }
  };

  const handleFileDelete = () => {
    const oldId = getOldImageId(img);
    setOldImageId(oldId);
    setImg("");
  };

  const getOldImageId = (imageURL: string) => {
    if (!imageURL) {
      return "";
    }
    const oldPath = extractPublicId(imageURL);

    const segments = oldPath.split("/");
    return segments[segments.length - 1];
  };

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleIntendedForInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntendedFor(e.target.value);
  };

  const handleCategoryInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedCategory = [...category];
    updatedCategory[index] = e.target.value;
    setCategory(updatedCategory);
  };

  const handleSizesInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = e.target.value;
    setSizes(updatedSizes);
  };

  const handleSourceInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedSource = [...source];
    updatedSource[index] = e.target.value;
    setSource(updatedSource);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const patternData = {
      name: name,
      image: img,
      intendedFor: intendedFor,
      category: category.filter((cat) => cat.trim() !== ""), // Get rid of empty lines
      sizes: sizes.filter((size) => size.trim() !== ""),
      source: source.filter((sour) => sour.trim() !== ""),
    };

    try {
      let patternResponse;
      if (patternId) {
        if (oldImageId) {
          // Delete old image from cloudinary storage
          await axios.delete(
            `${API_URL}/api/delete/image/pattern/${oldImageId}/${patternId}`,
            {
              withCredentials: true,
            }
          );
        }
        // Update pattern
        patternResponse = await axios.put(
          `${API_URL}/api/patterns/${patternId}`,
          patternData,
          { withCredentials: true }
        );
      } else {
        // Create new pattern
        patternResponse = await axios.post(
          `${API_URL}/api/patterns`,
          patternData,
          {
            withCredentials: true,
          }
        );
      }

      // Go back to pattern detail or dashboard
      if (patternId) {
        navigate(`/patterns/${patternId}`);
      } else {
        navigate("/");
      }
      // Jump to the top
      window.scrollTo(0, 0);
    } catch (error) {
      const errorDescription =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  const addNewField = (field: "sizes" | "category" | "source") => {
    const updateField = {
      sizes: () => setSizes([...sizes, ""]),
      category: () => setCategory([...category, ""]),
      source: () => setSource([...source, ""]),
    };

    updateField[field]?.();
  };

  const jumpToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3 className="pageTitle">Pattern</h3>
        <input
          required
          type="text"
          name="Name"
          className=""
          placeholder="Title..."
          value={name}
          onChange={handleNameInput}
        />
        <input
          required
          type="text"
          name="intendedFor"
          className=""
          placeholder="Intended for..."
          value={intendedFor}
          onChange={handleIntendedForInput}
        />
        <div className="">
          {img && <img src={img} className="" />}
          {img && !imageIsLoading && (
            <button type="button" className="" onClick={handleFileDelete}>
              <div className="buttonContentWrapper">
                <span className="buttonFont">Remove</span>
              </div>
            </button>
          )}
          <label className={`uploadButton ${img ? "buttonReverseHalf" : ""}`}>
            <input
              type="file"
              name="img"
              accept="image/png, image/jpg, image/jpeg, image/gif, image/webm, image/webp, image/heic"
              onChange={handleFileUpload}
            />
            {imageIsLoading ? (
              "🔄 loading ..."
            ) : img ? (
              <div className="buttonContentWrapper">
                <span className="buttonFont">Change</span>
              </div>
            ) : (
              <div className="buttonContentWrapper">
                <span className="buttonFont">Choose Image</span>
              </div>
            )}
          </label>
          {category.map((cat, index) => (
            <input
              type="text"
              name="category"
              className="mainFont"
              placeholder="Category..."
              value={cat}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleCategoryInput(e, index)
              }
              onClick={
                index === category.length - 1
                  ? () => addNewField("category")
                  : undefined
              }
            />
          ))}
          {sizes.map((size, index) => (
            <input
              type="text"
              name="size"
              className="mainFont"
              placeholder="Size..."
              value={size}
              onChange={(e) => handleSizesInput(e, index)}
              onClick={
                index === sizes.length - 1
                  ? () => addNewField("sizes")
                  : undefined
              }
            />
          ))}
          {source.map((sour, index) => (
            <input
              type="text"
              name="source"
              className="mainFont"
              placeholder="Source..."
              value={sour}
              onChange={(e) => handleSourceInput(e, index)}
              onClick={
                index === source.length - 1
                  ? () => addNewField("source")
                  : undefined
              }
            />
          ))}
        </div>
        <div className="action">
          <Link to={`/patterns/${patternId}`}>
            <button
              type="button"
              onClick={jumpToTop}
              className="buttonFont noUnderline primaryColor"
            >
              <div className="buttonContentWrapper">
                <span className="buttonFont">Cancel</span>
              </div>
            </button>
          </Link>
          <button type="submit" className="mainFont buttonReverse">
            <div className="buttonContentWrapper">
              <span className="buttonFont">Save</span>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPattern;
