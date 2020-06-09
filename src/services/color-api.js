export const fetchScheme = (hex, mode) => {
  return fetch(`https://www.thecolorapi.com/scheme?hex=${hex}&mode=${mode}&count=6`)
    .then(res => res.json())
    .then(scheme => scheme.colors.map(color => {
      return color.hex.value;
    }));
};

export const fetchColor = () => {
  const generateHex = Math.floor(Math.random() * 16777215).toString(16);
  return fetch(`https://www.thecolorapi.com/id?hex=${generateHex}`)
    .then(res => res.json());
};
