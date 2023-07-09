import React from "react";
import useSWRMutation from "swr/mutation";
import useLogin from "../../hook/useLogin";
import Layout from "../../components/Layout";

const Index = () => {
  const [inputEmail, setInputEmail] = React.useState("");
  const [inputPassword, setInputPassword] = React.useState("");
  const { trigger, data } = useSWRMutation("/api/login", useLogin);
  return (
    <>
      <Layout>
        {" "}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            trigger({ mail: inputEmail, password: inputPassword });
          }}
        >
          <div>
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => {
                setInputEmail(e.target.value);
              }}
              type="email"
              name="email"
              id="email"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => {
                setInputPassword(e.target.value);
              }}
              type="password"
              name="password"
              id="password"
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </Layout>
    </>
  );
};

export default Index;
