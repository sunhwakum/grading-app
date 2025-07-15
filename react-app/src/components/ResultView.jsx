import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

const COLORS = ["#00C49F", "#FF8042"];

export default function ResultView({ score, total, answers }) {
  const navigate = useNavigate();
  const correct = score;
  const incorrect = total - score;

  const data = [
    { name: "맞은 문제", value: correct },
    { name: "틀린 문제", value: incorrect },
  ];

  return (
    <div className="max-w-xl mx-auto mt-10 px-4 text-center">
      <h2 className="text-3xl font-bold mb-6">채점 결과</h2>

      <PieChart width={300} height={300} className="mx-auto">
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <h3 className="text-xl font-semibold mt-6 mb-4">
        총점: {score} / {total}
      </h3>

      <ul className="text-left max-w-md mx-auto">
        {answers.map((a, i) => (
          <li
            key={i}
            className={`mb-2 ${
              a.correct ? "text-green-700" : "text-red-600"
            }`}
          >
            <strong>문제 {i + 1}:</strong> {a.correct ? "⭕ 맞음" : "❌ 틀림"} <br />
            예상 답: <em>{a.expected}</em> / 입력 답: <em>{a.user}</em>
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold"
      >
        다시 채점하기
      </button>
    </div>
  );
}
