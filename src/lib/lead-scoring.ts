export interface MessagePart {
  text: string;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: MessagePart[];
}

export interface LeadScoreResult {
  score: number;
  label: "cold" | "warm" | "hot" | "urgent";
  matchedRules: string[];
}

// Regex rules for analyzing chat messages
const RULES = {
  price: {
    points: 10,
    patterns: [/giá\b/i, /bao\s*nhiêu/i, /nhiêu/i, /chi\s*phí/i, /tiền/i, /cost/i, /price/i, /báo\s*giá/i],
    description: "Hỏi giá"
  },
  dates: {
    points: 20,
    patterns: [
      /\bngày\b/i, 
      /\btháng\b/i, 
      /khởi\s*hành/i, 
      /lịch\s*trình/i, 
      /khi\s*nào/i, 
      /hôm\s*nào/i, 
      /đi\s*ngày/i, 
      /\b\d{1,2}\/\d{1,2}\b/
    ],
    description: "Có ngày đi"
  },
  guests: {
    points: 20,
    patterns: [
      /người\s*lớn/i, 
      /\bngười\b/i, 
      /\bkhách\b/i, 
      /mình\s*đi/i, 
      /adults/i, 
      /pax/i, 
      /đi\s*mấy/i, 
      /\d+\s*người/i
    ],
    description: "Có số người"
  },
  children: {
    points: 10,
    patterns: [/trẻ\s*em/i, /bé/i, /con/i, /cháu/i, /kids/i, /children/i, /em\s*bé/i, /phụ\s*thu\s*trẻ/i],
    description: "Có trẻ em"
  },
  availability: {
    points: 25,
    patterns: [
      /còn\s*phòng/i, 
      /còn\s*vé/i, 
      /còn\s*chỗ/i, 
      /còn\s*trống/i, 
      /available/i, 
      /booking/i, 
      /giữ\s*chỗ/i, 
      /giữ\s*vé/i
    ],
    description: "Hỏi còn phòng/vé/chỗ"
  },
  payment: {
    points: 35,
    patterns: [
      /cọc/i, 
      /đặt\s*cọc/i, 
      /thanh\s*toán/i, 
      /chuyển\s*khoản/i, 
      /pay/i, 
      /deposit/i, 
      /tài\s*khoản/i, 
      /bank/i
    ],
    description: "Hỏi cọc/thanh toán"
  },
  contact: {
    points: 40,
    patterns: [
      /0[3|5|7|8|9]\d{8}\b/, // VN Phone numbers
      /sđt/i, 
      /số\s*điện\s*thoại/i, 
      /zalo/i, 
      /phone/i, 
      /liên\s*hệ\s*qua/i
    ],
    description: "Để lại SĐT/Zalo"
  }
};

export function scoreLead(
  messages: ChatMessage[],
  hasProductContext: boolean = false
): LeadScoreResult {
  let score = 0;
  const matchedRules: string[] = [];

  // 1. Rule: Xem sản phẩm (+5)
  if (hasProductContext) {
    score += 5;
    matchedRules.push("Xem sản phẩm");
  }

  // Concatenate all user message texts to analyze the full intent
  const userTexts = messages
    .filter((msg) => msg.role === "user")
    .map((msg) => msg.parts.map((p) => p.text).join(" "))
    .join(" ");

  // Check each rule against the aggregated user text
  for (const [key, rule] of Object.entries(RULES)) {
    const isMatched = rule.patterns.some((pattern) => pattern.test(userTexts));
    if (isMatched) {
      score += rule.points;
      matchedRules.push(rule.description);
    }
  }

  // 2. Classify lead label based on score
  let label: "cold" | "warm" | "hot" | "urgent" = "cold";
  if (score >= 80) {
    label = "urgent";
  } else if (score >= 60) {
    label = "hot";
  } else if (score >= 30) {
    label = "warm";
  }

  return {
    score,
    label,
    matchedRules
  };
}
