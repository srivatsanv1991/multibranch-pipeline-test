import { combineReducers } from "redux";

const activityList = (activity = null, action) => {
  if (action.type == "SHOW_ACTIVITY") {
    return action.payload;
  }
  return activity;
};

export default combineReducers({
  activityList: activityList
});
