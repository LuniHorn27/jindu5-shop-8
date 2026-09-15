// Mock 商品資料 — 日後由後端 API 取代
export const CATEGORIES = [
  { id: "home", label: "居家清潔" },
  { id: "protect", label: "個人防護" },
  { id: "laundry", label: "衣物清潔" },
];

export const mockProducts = [
  {
    id: "p01",
    name: "淨毒五郎 次氯酸抑菌噴霧 500ml",
    category: "home",
    price: 690,
    salePrice: 490,
    thumbnail:
      "https://images.unsplash.com/photo-1585232351009-aa87416fca90?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1585232351009-aa87416fca90?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=1200&auto=format&fit=crop",
    ],
    shortDesc: "天然弱酸性配方，隨手一噴，居家環境溫和抑菌不刺激。",
    description:
      "淨毒五郎次氯酸抑菌噴霧採用天然電解水技術製成，pH 值接近人體肌膚，溫和不傷手，適合每天在客廳、廚房、玩具、寢具上使用，讓家人待在安心又乾淨的環境裡。",
    usage: [
      "距離物品表面約 15-20 公分均勻噴灑",
      "無須擦拭，靜置風乾即可",
      "建議開封後 3 個月內使用完畢，並避免高溫日曬",
    ],
    ingredients: "次氯酸水（HOCL）、純水、pH 穩定劑",
    stock: 120,
  },
  {
    id: "p02",
    name: "淨毒五郎 隨身抑菌噴霧 60ml 攜帶瓶",
    category: "protect",
    price: 280,
    salePrice: 199,
    thumbnail:
      "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585232351009-aa87416fca90?q=80&w=1200&auto=format&fit=crop",
    ],
    shortDesc: "口袋、包包都能放，外出安心防護不佔空間。",
    description:
      "小巧輕便的隨身瓶設計，方便攜帶進辦公室、學校與大眾運輸空間。同樣採用溫和弱酸性配方，隨時為雙手與周遭環境做好防護。",
    usage: ["直接噴灑於手部、物品表面", "亦可噴灑於口罩內外層", "隨身攜帶，建議常溫保存"],
    ingredients: "次氯酸水（HOCL）、純水、pH 穩定劑",
    stock: 300,
  },
  {
    id: "p03",
    name: "淨毒五郎 衣物除菌噴霧 350ml",
    category: "laundry",
    price: 450,
    salePrice: 350,
    thumbnail:
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1200&auto=format&fit=crop",
    ],
    shortDesc: "衣物、寢具、沙發除菌除臭，洗完更安心。",
    description:
      "專為布料設計的除菌配方，不需水洗即可噴灑於衣物、寢具、沙發、汽車座椅等布面，有效去除異味與細菌殘留，讓一家人的貼身衣物更安心。",
    usage: ["均勻噴灑於布料表面 20-30 公分處", "待自然風乾即可穿著或使用", "深色衣物建議先於不明顯處測試"],
    ingredients: "次氯酸水（HOCL）、天然清香因子、純水",
    stock: 200,
  },
  {
    id: "p04",
    name: "淨毒五郎 廚房油污清潔劑 750ml",
    category: "home",
    price: 380,
    salePrice: 299,
    thumbnail:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585232351009-aa87416fca90?q=80&w=1200&auto=format&fit=crop",
    ],
    shortDesc: "天然椰油配方，輕鬆分解油污，廚房檯面安心清潔。",
    description:
      "以椰子油萃取界面活性劑製成，能快速分解廚房中頑固油垢，沖洗後不易殘留化學成分，適合每日清潔流理台、瓦斯爐與抽油煙機。",
    usage: ["噴灑於油污處，靜置 1-2 分鐘", "以濕布或菜瓜布輕輕擦拭", "最後以清水沖淨即可"],
    ingredients: "椰油起泡劑、天然檸檬精油、純水",
    stock: 150,
  },
  {
    id: "p05",
    name: "淨毒五郎 口罩專用抑菌噴霧 100ml",
    category: "protect",
    price: 320,
    salePrice: 249,
    thumbnail:
      "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=1200&auto=format&fit=crop",
    ],
    shortDesc: "延長口罩使用安心感，出門在外更有保障。",
    description:
      "特別針對口罩材質設計的低刺激配方，可噴灑於口罩內外層，減少異味殘留並增加防護安心感，適合長時間配戴口罩的族群。",
    usage: ["距離口罩表面 15 公分均勻輕噴", "待風乾後再配戴", "避免噴灑於眼口黏膜部位"],
    ingredients: "次氯酸水（HOCL）、純水",
    stock: 180,
  },
  {
    id: "p06",
    name: "淨毒五郎 寢具床墊清新噴霧 500ml",
    category: "laundry",
    price: 520,
    salePrice: 420,
    thumbnail:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1200&auto=format&fit=crop",
    ],
    shortDesc: "每晚好眠從乾淨的床開始，溫和不刺鼻。",
    description:
      "專為床墊、枕頭、棉被設計的清新配方，溫和抑菌同時降低塵蟎孳生機率，讓睡眠環境時刻保持清爽舒適。",
    usage: ["均勻噴灑於寢具表面", "建議睡前 1 小時使用，待風乾後再上床", "每週使用 2-3 次效果更佳"],
    ingredients: "次氯酸水（HOCL）、天然植萃香氛、純水",
    stock: 140,
  },
];
