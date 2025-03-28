// src/pages/PatternDetailPage.tsx
import React from "react";
import { Pattern } from "../service/pattern.service";

interface PatternProps {
  patterns: Pattern[];
}

const PatternSearchbar: React.FC<PatternProps> = ({ patterns }) => {
  const uniqueIntendedFor = Array.from(
    new Set(patterns.map((pattern) => pattern.intendedFor))
  );
  const url = new URL(window.location.href);
  //   url.searchParams.set("secondaryParam", "value");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.history.pushState({}, "", url.toString());
    // window.location.reload();
    console.log("Search");
  };

  const setPrimaryParam = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("intendedFor", value);
    window.history.pushState({}, "", url.toString());
    console.log("value: ", value);
  };

  return (
    <div>
      <form onSubmit={submitSearch}>
        {uniqueIntendedFor.map((intFor, index) => (
          <div key={index}>
            <input
              type="radio"
              value={intFor}
              name="intendedFor"
              id={intFor}
              onClick={() => {
                setPrimaryParam(intFor);
              }}
            />
            <label htmlFor={intFor}>{intFor}</label>
          </div>
        ))}
        {/* {patterns.category.map((cat, index) => {
          <div key={index}>
            <input
              type="radio"
              value={cat}
              name={cat}
              onClick={() => {
                setPrimaryParam(cat);
              }}
            />
          </div>;
        })} */}
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default PatternSearchbar;
