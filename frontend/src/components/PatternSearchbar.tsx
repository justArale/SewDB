// // src/pages/PatternDetailPage.tsx
// import React from "react";
// import { Pattern } from "../service/pattern.service";
// import { useNavigate } from "react-router-dom";
// interface PatternProps {
//   patterns: Pattern[];
// }

// const PatternSearchbar: React.FC<PatternProps> = ({ patterns }) => {
//   const uniqueIntendedFor = Array.from(
//     new Set(patterns.map((pattern) => pattern.intendedFor))
//   );
//   const uniqueCategory = Array.from(
//     new Set(patterns.map((pattern) => pattern.category))
//   );

//   const navigate = useNavigate();
//   const url = new URL(window.location.href);

//   const submitSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     window.history.pushState({}, "", url.toString());
//     console.log("Search");
//   };

//   const setPrimaryParam = (value: string) => {
//     const url = new URL(window.location.href);
//     url.searchParams.set("primaryParam", "intendedFor");
//     url.searchParams.set("primaryValue", value);
//     console.log("Navigating to:", url.toString());

//     navigate(`${url.pathname}?${url.searchParams.toString()}`);
//     console.log("value: ", value);
//   };

//   const setSecondaryParam = (value: string) => {
//     const url = new URL(window.location.href);
//     url.searchParams.set("secondaryParam", "category");
//     url.searchParams.set("secondarValue", value);
//     console.log("Navigating to:", url.toString());

//     navigate(`${url.pathname}?${url.searchParams.toString()}`);
//     console.log("value: ", value);
//   };

//   return (
//     <>
//       <form onSubmit={submitSearch}>
//         {uniqueIntendedFor.map((intFor, index) => (
//           <div key={index}>
//             <input
//               type="radio"
//               value={intFor}
//               name="intendedFor"
//               id={intFor}
//               onClick={() => {
//                 setPrimaryParam(intFor);
//               }}
//             />
//             <label htmlFor={intFor}>{intFor}</label>
//           </div>
//         ))}
//         {uniqueCategory.map((cat, index) => (
//           <div key={index}>
//             <input
//               type="radio"
//               value={cat}
//               name={cat}
//               onClick={() => {
//                 setSecondaryParam(cat);
//               }}
//             />
//             <label htmlFor={cat}>{cat}</label>
//           </div>
//         ))}
//         <button type="submit">Search</button>
//       </form>
//     </>
//   );
// };

// export default PatternSearchbar;

// // {patterns.map((pattern, index) =>
// //   pattern.category.map((cat, catIndex) => (
// //     <div key={`${index}-${catIndex}`}>
// //       <input
// //         type="radio"
// //         value={cat}
// //         name={cat}
// //         onClick={() => {
// //           setPrimaryParam(cat);
// //         }}
// //       />
// //       <label htmlFor={cat}>{cat}</label>
// //     </div>
// //   ))
// // )}
