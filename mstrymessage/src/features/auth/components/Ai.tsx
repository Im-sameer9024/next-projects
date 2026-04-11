"use client";

import React, { useState } from "react";
import axios from "axios";

const Ai = () => {
  const [text, setText] = useState("");

  const Generate = async () => {
    const finalData = {
      prompt: text,
    };

    try {
      const response = await axios.post("/api/suggest-messages", finalData);
      console.log(response);
    } catch (error) {
      console.log("error occur", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={() => Generate()}>submit</button>
    </div>
  );
};

export default Ai;
