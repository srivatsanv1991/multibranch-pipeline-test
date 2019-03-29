import React from "react";
import ReactDOM from "react-dom";
import { mount, shallow, render } from "enzyme";
import Home from "../src/components/Home/Home";
import Login from "../src/components/Login/Login";

/*it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
}); */
it("should be possible to activate button with Spacebar", () => {
  const component = mount(<Home />);
  component.find("button#handleSubmit").simulate("keydown", { keyCode: 32 });
  expect(component).toMatchSnapshot();
  component.unmount();
});

describe("ShowName", () => {
  const wrapper = shallow(<Login />);
  console.log(wrapper.state());
});

describe("Home", () => {
  const wrapper = shallow(<Home />);
  console.log(wrapper.state());
});
