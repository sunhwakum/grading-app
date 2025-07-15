# back/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Literal

app = FastAPI()

# 저장용 (실무는 DB)
weights = {}       # {문항번호: 배점}
key_common = {}    # {문항번호: 정답}
key_eommae = {}
key_hwajak = {}

student_answers = []  # [{'name': str, 'subject': '언매'|'화작', 'answers': List[str]}]

NUM_COMMON = 34
NUM_QUESTIONS = 45


class KeyPayload(BaseModel):
    weights: Dict[int, float]
    key_common: Dict[int, str]
    key_eommae: Dict[int, str]
    key_hwajak: Dict[int, str]


@app.post("/set_key")
async def set_key(payload: KeyPayload):
    global weights, key_common, key_eommae, key_hwajak
    weights = payload.weights
    key_common = payload.key_common
    key_eommae = payload.key_eommae
    key_hwajak = payload.key_hwajak
    return {"msg": "Keys and weights set successfully"}


class StudentAnswer(BaseModel):
    name: str
    subject: Literal['언매', '화작']
    answers: List[str]  # 길이 45


@app.post("/submit_answers")
async def submit_answers(students: List[StudentAnswer]):
    global student_answers
    student_answers = students
    return {"msg": f"{len(students)} student answers received"}


@app.get("/grade")
async def grade():
    if not weights or not key_common:
        raise HTTPException(status_code=400, detail="Keys are not set")

    results = []
    for stu in student_answers:
        score = 0.0
        for q in range(1, NUM_QUESTIONS + 1):
            student_ans = stu.answers[q-1] if q-1 < len(stu.answers) else ''
            correct = False
            if q <= NUM_COMMON:
                correct = (student_ans == key_common.get(q, ''))
            else:
                if stu.subject == '언매':
                    correct = (student_ans == key_eommae.get(q, ''))
                else:
                    correct = (student_ans == key_hwajak.get(q, ''))
            if correct:
                score += weights.get(q, 0)
        results.append({"name": stu.name, "subject": stu.subject, "score": score})

    # 점수 순으로 정렬 및 등수 매기기
    results.sort(key=lambda x: x['score'], reverse=True)
    for i, r in enumerate(results):
        r['rank'] = i + 1

    return {"results": results}
import uvicorn
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Render가 주는 PORT 값 사용
    uvicorn.run("main:app", host="0.0.0.0", port=port)
