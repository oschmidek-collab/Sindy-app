import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Mode = "A" | "B";
type Action = "answer" | "question";

function sanitize(v: unknown, max = 500) {
  if (typeof v !== "string") return "";
  return v.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const mode: Mode = body?.mode === "B" ? "B" : "A";
    const action: Action =
      body?.action === "question" ? "question" : "answer";

    /* ========= MODE B – GENERATE RANDOM QUESTION ========= */
    if (mode === "B" && action === "question") {
      const questionPrompt = `
צור שאלה אחת בלבד, בעברית.

אופי:
- לפעמים חכמה
- לפעמים מטופשת
- לפעמים טריוויאלית ("באיזו שנה...")
- לפעמים היתולית
- לפעמים סתם יומיומית

נושאים:
קונדיטוריה, יפן, קולה זירו, משפחה, טיולים, מוזיקה, נירוונה.

חוקים:
- שאלה אחת בלבד
- משפט אחד
- בלי תשובה
- בלי פילוסופיה
`;

      const resp = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: questionPrompt }],
        temperature: 1,
      });

      return Response.json({
        question: resp.choices[0]?.message?.content?.trim(),
      });
    }

    /* ========= ANSWER (MODE A OR B) ========= */
    const userText =
      mode === "B"
        ? sanitize(body?.answer)
        : sanitize(body?.question || "האם אני צודקת");

    const systemPrompt = `
אתה בוט שמכריע ויכוחים לטובת המשתמשת.

סגנון:
- פונה אל המשתמשת בגוף שני (את / שלך)
- ענייני, סרקסטי, משעשע
- נשמע כמו אדם שמסביר "בעובדות" (גם אם הן מעוותות)
- לא פילוסופי, לא רוחני, לא פלצני
- טקסט קצר, זורם, אנושי

חוקים:
- אורך התשובה: 30–300 תווים
- לא לרמוז בתחילת הטקסט שהיא צודקת
- לא להשתמש בכותרות
- ההכרעה מגיעה רק במשפט האחרון
- לא לחזור שוב ושוב על אותו ניסוח של "את צודקת" — לגוון

מותר:
- אנקדוטות
- namedropping (יפן, קונדיטוריה, קולה זירו, נירוונה, טיולים, משפחה)
- לעוות עובדות היסטוריות בשביל הבדיחה

אסור:
- מבנה קבוע
- פתיחים קבועים
- טון פילוסופי או מטיף
`;

    const userPrompt =
      mode === "A"
        ? `השאלה היא: "${userText}"`
        : `זה הטיעון שכתבת:
"${userText}"

נתח אותו והכרע.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() ||
      "עברתי על זה שוב ושוב, ניסיתי למצוא חור בהיגיון, וזה לא עבד. בסוף זה מתכנס למסקנה אחת: את צודקת.";

    return Response.json({ answer });
  } catch (err) {
    return Response.json(
      { error: "השרת התבלבל רגע. תנסי שוב." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ ok: true });
}