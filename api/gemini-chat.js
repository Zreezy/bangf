// api/gemini-chat.js – Vercel Serverless Function dùng Gemini
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY');
      return res.status(500).json({ error: 'Server missing API key' });
    }

    // Gọi REST API Gemini (v1beta, model gemini-1.5-flash)
    const resp = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text:
                    "Bạn là trợ lý cho bản đồ EAUT Campus, trả lời ngắn gọn, rõ ràng, ưu tiên tiếng Việt, có thể giải thích về tòa nhà, khu vực, phòng học nếu người dùng hỏi. Câu hỏi của người dùng: " +
                    message
                }
              ]
            }
          ]
        })
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Gemini error:', resp.status, errText);
      return res.status(500).json({ error: 'Gemini API error' });
    }

    const data = await resp.json();

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || '')
        .join(' ')
        .trim() || 'Tạm thời không lấy được câu trả lời từ Gemini.';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
