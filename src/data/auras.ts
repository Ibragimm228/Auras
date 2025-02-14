import { Aura } from '../types';

export const auras: Aura[] = [
  // Обычные ауры с высокими шансами (25-50%)
  {
    name: "Аура Начинающего",
    color: "#A7C7E7",
    chance: 50,
    description: "Базовая аура, излучающая потенциал роста"
  },
  {
    name: "Аура Ученика",
    color: "#98FF98",
    chance: 47,
    description: "Аура, отражающая стремление к знаниям"
  },
  {
    name: "Аура Искателя",
    color: "#FFB347",
    chance: 35,
    description: "Аура любопытства и жажды открытий"
  },
  {
    name: "Аура Мечтателя",
    color: "#DDA0DD",
    chance: 29,
    description: "Аура, наполненная светлыми мечтами"
  },
  {
    name: "Аура Творца",
    color: "#87CEEB",
    chance: 16,
    description: "Аура креативности и созидания"
  },
  {
    name: "Аура Странника",
    color: "#D3D3D3",
    chance: 43,
    description: "Аура путешественника и искателя приключений"
  },
  {
    name: "Аура Наблюдателя",
    color: "#98FB98",
    chance: 32,
    description: "Аура внимательного созерцателя мира"
  },
  {
    name: "Аура Исследователя",
    color: "#B8860B",
    chance: 42,
    description: "Аура пытливого ума и научного интереса"
  },
  {
    name: "Аура Слушателя",
    color: "#E6E6FA",
    chance: 46,
    description: "Аура понимания и эмпатии"
  },
  {
    name: "Аура Помощника",
    color: "#FFA07A",
    chance: 49,
    description: "Аура доброты и готовности помочь"
  },
  {
    name: "Аура Хранителя",
    color: "#8FBC8F",
    chance: 26,
    description: "Аура защиты и заботы"
  },
  {
    name: "Аура Друга",
    color: "#FFB6C1",
    chance: 48,
    description: "Аура дружелюбия и открытости"
  },
  {
    name: "Аура Целителя",
    color: "#98FB98",
    chance: 10,
    description: "Аура восстановления и поддержки"
  },
  {
    name: "Аура Мастера",
    color: "#DEB887",
    chance: 15,
    description: "Аура опыта и практических навыков"
  },
  {
    name: "Аура Художника",
    color: "#FF69B4",
    chance: 28,
    description: "Аура творческого самовыражения"
  },
  {
    name: "Аура Музыканта",
    color: "#9370DB",
    chance: 17,
    description: "Аура гармонии и мелодии"
  },
  {
    name: "Аура Писателя",
    color: "#F0E68C",
    chance: 12,
    description: "Аура словесного творчества"
  },
  {
    name: "Аура Танцора",
    color: "#FF69B4",
    chance: 39,
    description: "Аура грации и движения"
  },
  {
    name: "Аура Спортсмена",
    color: "#FF4500",
    chance: 15,
    description: "Аура физической силы и выносливости"
  },
  {
    name: "Аура Учителя",
    color: "#FFD700",
    chance: 22,
    description: "Аура мудрости и передачи знаний"
  },

  // легендарные ауры (1-2%)
  {
    name: "Космическая Аура",
    color: "#663399",
    chance: 1,
    description: "Легендарная аура, содержащая энергию самой вселенной"
  },
  {
    name: "Божественная Аура",
    color: "#FFD700",
    chance: 1,
    description: "Священная аура высших сил и божественного благословения"
  },
  {
    name: "Драконья Аура",
    color: "#FF4500",
    chance: 2,
    description: "Могущественная аура древних драконов"
  },

  // Епические ауры (2-3%)
  {
    name: "Феникс Аура",
    color: "#FF6B6B",
    chance: 2,
    description: "Пылающая аура возрождения и бессмертия"
  },
  {
    name: "Лунная Аура",
    color: "#E6E6FA",
    chance: 2,
    description: "Мистическая аура лунного света и ночной магии"
  },
  {
    name: "Звёздная Аура",
    color: "#4B0082",
    chance: 2,
    description: "Сияющая аура звёздного света и космической энергии"
  },
  {
    name: "Радужная Аура",
    color: "#FF1493",
    chance: 3,
    description: "Переливающаяся всеми цветами радуги аура"
  },
  {
    name: "Кристальная Аура",
    color: "#00CED1",
    chance: 3,
    description: "Чистая аура с энергией горного хрусталя"
  },

  // редкие ауры (3-5%)
  {
    name: "Изумрудная Аура",
    color: "#50C878",
    chance: 3,
    description: "Редкая аура природной гармонии и роста"
  },
  {
    name: "Сапфировая Аура",
    color: "#0F52BA",
    chance: 3,
    description: "Глубокая аура мудрости и спокойствия"
  },
  {
    name: "Рубиновая Аура",
    color: "#E0115F",
    chance: 4,
    description: "Страстная аура силы и энергии"
  },
  {
    name: "Янтарная Аура",
    color: "#FFBF00",
    chance: 4,
    description: "Тёплая аура древней мудрости"
  },
  {
    name: "Аметистовая Аура",
    color: "#9966CC",
    chance: 4,
    description: "Духовная аура просветления"
  },
  {
    name: "Опаловая Аура",
    color: "#B8F2E6",
    chance: 5,
    description: "Переливающаяся аура удачи и перемен"
  },

  // сврехредкие ауры (5-7%)
  {
    name: "Серебряная Аура",
    color: "#C0C0C0",
    chance: 5,
    description: "Благородная аура чистоты и защиты"
  },
  {
    name: "Бронзовая Аура",
    color: "#CD7F32",
    chance: 5,
    description: "Стойкая аура силы и выносливости"
  },
  {
    name: "Малахитовая Аура",
    color: "#0BDA51",
    chance: 5,
    description: "Целительная аура природной энергии"
  },
  {
    name: "Лазуритовая Аура",
    color: "#26619C",
    chance: 6,
    description: "Глубокая аура истины и понимания"
  },
  {
    name: "Коралловая Аура",
    color: "#FF7F50",
    chance: 6,
    description: "Живая аура морской энергии"
  },
  {
    name: "Нефритовая Аура",
    color: "#00A36C",
    chance: 6,
    description: "Гармоничная аура баланса и спокойствия"
  },
  {
    name: "Жемчужная Аура",
    color: "#FDEEF4",
    chance: 7,
    description: "Элегантная аура чистоты и совершенства"
  },

  // обычные ауры (7-10%)
  {
    name: "Аура Рассвета",
    color: "#FF9A8B",
    chance: 7,
    description: "Пробуждающая аура нового дня"
  },
  {
    name: "Аура Заката",
    color: "#FF6B6B",
    chance: 7,
    description: "Умиротворяющая аура вечернего света"
  },
  {
    name: "Лесная Аура",
    color: "#228B22",
    chance: 7,
    description: "Живительная аура лесной свежести"
  },
  {
    name: "Горная Аура",
    color: "#4A6741",
    chance: 8,
    description: "Стойкая аура горных вершин"
  },
  {
    name: "Речная Аура",
    color: "#4F97A3",
    chance: 8,
    description: "Текучая аура водной стихии"
  },
  {
    name: "Полярная Аура",
    color: "#E0FFFF",
    chance: 8,
    description: "Морозная аура северного сияния"
  },
  {
    name: "Песчаная Аура",
    color: "#F4A460",
    chance: 8,
    description: "Тёплая аура пустынных ветров"
  },
  {
    name: "Аура Тумана",
    color: "#B8B8B8",
    chance: 9,
    description: "Таинственная аура утреннего тумана"
  },
  {
    name: "Аура Облаков",
    color: "#E6E6E6",
    chance: 9,
    description: "Лёгкая аура небесной высоты"
  },
  {
    name: "Аура Дождя",
    color: "#6B8E23",
    chance: 9,
    description: "Освежающая аура летнего дождя"
  },
  {
    name: "Аура Ветра",
    color: "#87CEEB",
    chance: 10,
    description: "Свободная аура воздушных потоков"
  },
  // Абсолютная аура (0,01%)
  {
    name: "Аура Абсолюта",
    color: "#530b8e",
    chance: 0.01,
    description: "Аура абсолютного совершенства и гармонии мира" 
  }
];