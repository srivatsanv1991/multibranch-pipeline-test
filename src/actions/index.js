export const selectActivity = (email, title, description, date) => {
  return {
    type: "SHOW_ACTIVITY",
    payload: {
      email: email,
      title: title,
      description: description,
      date: date
    }
  };
};
