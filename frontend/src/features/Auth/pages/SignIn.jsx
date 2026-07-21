import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import DynamicForm from "../../../shared/components/FormsField/DynamicForm";
import "./SignIn.css";
import { useAuth } from "../hooks/useAuth";
import { Login, Register } from "../graphql/mutation";
import { GetAllRoles } from "../../../shared/services/queries";

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [backendErrors, setBackendErrors] = useState({});

  const { setToken, setUser } = useAuth();
  const [loginAction, { loading: isLoggingIn }] = useMutation(Login);
  const [registerAction, { loading: isRegistering }] = useMutation(Register);

  const { data, loading: rolesLoading } = useQuery(GetAllRoles, {
    skip: isLogin,
  });

  const handleFormSubmit = useCallback(async (formData, resetForm) => {
    setBackendErrors({});
    try {
      if (isLogin) {
        const loginData = await loginAction({
          variables: {
            input: {
              email: formData.email,
              password: formData.password,
            },
          },
        });

        const token = loginData.data.login;
        localStorage.setItem("token", token);
        setToken(token);
        resetForm();
      } else {
        const registerData = await registerAction({
          variables: {
            input: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
              roleId: Number(formData.roleId),
            },
          },
        });

        const user = registerData.data.register;
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        resetForm();
        setIsLogin(true);
      }
    } catch (err) {
      if (err.graphQLErrors && err.graphQLErrors?.extensions?.validation) {
        setBackendErrors(err.graphQLErrors.extensions.validation);
      } else {
        setBackendErrors({ global: err.message });
      }
    }
  }, [isLogin, loginAction, registerAction, setToken, setUser]);

  const toggleAuthMode = useCallback(() => {
    setBackendErrors({});
    setIsLogin(!isLogin);
  }, []);

  const loginSchema = useMemo(() => [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      validators: [{ type: "required", message: "Email is required" }],
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      validators: [{ type: "required", message: "Password is required" }],
    },
  ], []);

  const registerSchema = useMemo(() => [
    {
      name: "firstName",
      type: "text",
      placeholder: "First Name",
      validators: [{ type: "required", message: "First name is required" }],
    },
    {
      name: "lastName",
      type: "text",
      placeholder: "Last Name",
    },
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      validators: [{ type: "required", message: "Email is required" }],
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      validators: [{ type: "required", message: "Password is required" }],
    },
    {
      name: "roleId",
      type: "select",
      label: "Role",
      placeholder: "Select Role",
      validators: [{ type: "required", message: "Role is required" }],
      options: (data?.getAllRoles || []).map((role) => ({
        value: role.id,
        label: role.role_name,
      })),
    },
  ], [data]);

  if (!isLogin && rolesLoading) {
    return (
      <div className="authContainer">
        <div className="authCard">
          <p>Loading available roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="authContainer">
      <div className="authCard">
        <h1>{isLogin ? "Sign In" : "Sign Up"}</h1>

        {backendErrors.global && (
          <div
            className="global-error"
            style={{ color: "#ef4444", marginBottom: "15px", fontSize: "14px" }}
          >
            {backendErrors.global}
          </div>
        )}

        <DynamicForm
          config={isLogin ? loginSchema : registerSchema}
          onSubmit={handleFormSubmit}
          backendErrors={backendErrors}
          isSubmitting={isLogin ? isLoggingIn : isRegistering}
        />

        <h3 className="toggleText" onClick={toggleAuthMode}>
          {isLogin ? "Create Account?" : "Already have an account? Login"}
        </h3>
      </div>
    </div>
  );
};

export default SignIn;
