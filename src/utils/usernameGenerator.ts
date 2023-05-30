export const userNameGenerator = (): string => {
  var names = [
    "Jamila",
    "Amani",
    "Faraja",
    "Kito",
    "Zuri",
    "Baraka",
    "Bahati",
    "Jengo",
    "Subira",
    "Kibibi",
  ];
  var adjectives = [
    "Rafiki",
    "Mwema",
    "Furaha",
    "Upendo",
    "Tumaini",
    "Usawa",
    "Amani",
    "Bahati",
    "Jengo",
    "Subira",
  ];

  var randomName = names[Math.floor(Math.random() * names.length)];
  var randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];

  return randomName + " " + randomAdjective;
};
