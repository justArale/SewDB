// src/components/AddPattern.tsx
import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  uploadPatternImage,
  deletePatternImage,
} from "../service/image.service";
import {
  Pattern,
  createNewPattern,
  updatePattern,
} from "../service/pattern.service";

const AddPattern: React.FC<{ existingPattern?: Pattern }> = ({
  existingPattern,
}) => {
  const { patternId } = useParams<{ patternId: string }>();
  const [oldImageUrl, setOldImageUrl] = useState<string[] | undefined>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageIsLoading, setImageIsLoading] = useState<boolean>(false);

  let navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [intendedFor, setIntendedFor] = useState<string>("");
  const [images, setImages] = useState<string[]>([""]);
  const [category, setCategory] = useState<string[]>([""]);
  const [sizes, setSizes] = useState<string[]>([""]);
  const [source, setSource] = useState<string[]>([""]);

  useEffect(() => {
    if (existingPattern) {
      setName(existingPattern.name);
      setIntendedFor(existingPattern.intendedFor);

      setImages(
        Array.isArray(existingPattern.image) && existingPattern.image.length > 0
          ? existingPattern.image.map((img) => {
              return img;
            })
          : [""]
      );
      setCategory(
        Array.isArray(existingPattern.category) &&
          existingPattern.category.length > 0
          ? existingPattern.category.map((cat) => {
              return cat;
            })
          : [""]
      );
      setSizes(
        Array.isArray(existingPattern.sizes) && existingPattern.sizes.length > 0
          ? existingPattern.sizes.map((size) => {
              return size;
            })
          : [""]
      );
      setSource(
        Array.isArray(existingPattern.source) &&
          existingPattern.source.length > 0
          ? existingPattern.source.map((sour) => {
              return sour;
            })
          : [""]
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
      const fileData = new FormData();
      fileData.append("image", file);

      const fileUrl = await uploadPatternImage(fileData);

      if (fileUrl) {
        console.log("fileUrl.url inside if: ", fileUrl.url);
        if (fileUrl && typeof fileUrl === "object" && fileUrl.url) {
          setImages((prevImages) => [...prevImages, fileUrl.url]);
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

  const handleFileDelete = (index: number) => {
    setOldImageUrl((oldImageUrl) => [...(oldImageUrl || []), images[index]]);
    // Remove the image from the displayed images array
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
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
    updatedCategory[index] = e.target.value || "";
    setCategory(updatedCategory);
  };

  const handleSizesInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = e.target.value || "";
    setSizes(updatedSizes);
  };

  const handleSourceInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedSource = [...source];
    updatedSource[index] = e.target.value || "";
    setSource(updatedSource);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const patternData = {
      id: patternId,
      name: name,
      image: images.filter((img) => img.trim() !== ""),
      intendedFor: intendedFor,
      category: category.filter((cat) => cat.trim() !== ""), // Get rid of empty lines
      sizes: sizes.filter((size) => size.trim() !== ""),
      source: source.filter((sour) => sour.trim() !== ""),
    };

    try {
      if (patternId) {
        if (oldImageUrl) {
          oldImageUrl.forEach(async (image) => {
            await deletePatternImage(image);
          });
        }
        // Update pattern
        updatePattern(patternData);
      } else {
        // Create new pattern
        createNewPattern(patternData);
      }

      // Go back to pattern detail or dashboard
      if (patternId) {
        navigate(`/patterns/${patternId}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error with submitting the pattern: ", error);
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
          <input
            type="file"
            name="img"
            accept="image/png, image/jpg, image/jpeg, image/gif, image/webm, image/webp, image/heic"
            onChange={handleFileUpload}
          />
          {images.map((img, index) => (
            <div key={index}>
              {img && <img src={img} className="" />}
              {img && !imageIsLoading && (
                <button
                  type="button"
                  className=""
                  onClick={() => handleFileDelete(index)}
                >
                  <div className="buttonContentWrapper">
                    <span className="buttonFont">Remove</span>
                  </div>
                </button>
              )}
              {/* <label
                className={`uploadButton ${img ? "buttonReverseHalf" : ""}`}
              >
                <input
                  type="file"
                  name="img"
                  accept="image/png, image/jpg, image/jpeg, image/gif, image/webm, image/webp, image/heic"
                  onChange={(e) => handleFileUpload(e, index)}
                />
                {imageIsLoading ? (
                  "🔄 loading ..."
                ) : img[index] ? (
                  <div className="buttonContentWrapper">
                    <span className="buttonFont">Change</span>
                  </div>
                ) : (
                  <div
                    className="buttonContentWrapper"
                    onClick={
                      index === images.length - 1
                        ? () => addNewField("images")
                        : undefined
                    }
                  >
                    <span className="buttonFont">Choose Image</span>
                  </div>
                )}
              </label> */}
            </div>
          ))}
          {category.map((cat, index) => (
            <div key={index}>
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
            </div>
          ))}
          {sizes.map((size, index) => (
            <div key={index}>
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
            </div>
          ))}
          {source.map((sour, index) => (
            <div key={index}>
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
            </div>
          ))}
        </div>
        <div className="action">
          <Link to={`/patterns/${patternId}`}>
            <button
              type="button"
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
