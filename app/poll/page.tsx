"use client";

import InputScore from "@/components/InputScore";
import axios from "axios";
import { useState } from "react";

const PollPage = () => {
  const [finuazScore, setFinuazScore] = useState(0);
  const [pojanScore, setPojanScore] = useState(0);
  const [olenterScore, setOlenterScore] = useState(0);
  const [mahdoScore, setMahdoScore] = useState(0);
  const [caturScore, setCaturScore] = useState(0);
  const [bintangScore, setBintangScore] = useState(0);

  const remainingPoints =
    1000 -
    (finuazScore +
      pojanScore +
      olenterScore +
      mahdoScore +
      caturScore +
      bintangScore); // Example value, replace with actual logic to get remaining points

  const handleSubmitPoll = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      finuaz: finuazScore,
      pojan: pojanScore,
      olenter: olenterScore,
      mahdo: mahdoScore,
      catur: caturScore,
      bintang: bintangScore,
    });

    const polls = [
      { name: "Finuaz", poll_by: "Bintang", poll: finuazScore },
      { name: "Pojan", poll_by: "Bintang", poll: pojanScore },
      { name: "Olenter", poll_by: "Bintang", poll: olenterScore },
      { name: "Mahdo", poll_by: "Bintang", poll: mahdoScore },
      { name: "Catur", poll_by: "Bintang", poll: caturScore },
      { name: "Bintang", poll_by: "Bintang", poll: bintangScore },
    ];

    if (remainingPoints < 0) {
      alert("You have exceeded the maximum allowed points.");
      return;
    }

    try {
      const request = polls.map((poll) => {
        axios.post("http://localhost:8000/polls/poll", poll);
      });
      const responses = await Promise.all(request);

      console.log(
        "All polls created:",
        responses.map((r) => r),
      );
    } catch (error) {
      console.error("Error submitting poll:", error);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
      <main className="bg-white text-black p-3 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl">Polling</h1>
          <h2>
            Remaining Points:{" "}
            <span className="font-bold text-red-600">{remainingPoints}</span>
          </h2>
        </div>
        <form
          onSubmit={handleSubmitPoll}
          className="flex flex-col gap-4"
          action=""
          method="post"
        >
          <InputScore
            label="Finuaz"
            name="finuaz"
            id="finuaz"
            onChange={(e) => setFinuazScore(Number(e.target.value))}
            value={finuazScore}
          />
          <InputScore
            label="Pojan"
            name="pojan"
            id="pojan"
            onChange={(e) => setPojanScore(Number(e.target.value))}
            value={pojanScore}
          />
          <InputScore
            label="Olenter"
            name="olenter"
            id="olenter"
            onChange={(e) => setOlenterScore(Number(e.target.value))}
            value={olenterScore}
          />
          <InputScore
            label="Mahdo"
            name="mahdo"
            id="mahdo"
            onChange={(e) => setMahdoScore(Number(e.target.value))}
            value={mahdoScore}
          />
          <InputScore
            label="Catur"
            name="catur"
            id="catur"
            onChange={(e) => setCaturScore(Number(e.target.value))}
            value={caturScore}
          />
          <InputScore
            label="Bintang"
            name="bintang"
            id="bintang"
            onChange={(e) => setBintangScore(Number(e.target.value))}
            value={bintangScore}
          />
          <div className="mx-auto mb-1">
            <button
              type="submit"
              className="bg-violet-500 text-white px-4 py-1.5 rounded-lg"
            >
              Submit Poll
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PollPage;
