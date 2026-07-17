import React, { useContext, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Login, Register } from '../graphql/mutations'
import { AuthContext } from '../context/AuthContext'
import './SignIn.css'
import { GetAllRoles } from '../graphql/queries'

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', roleId: null })
  
  const { setToken, setUser } = useContext(AuthContext);
  const [loginAction] = useMutation(Login)
  const [registerAction] = useMutation(Register)

  const [selectedRoleId, setSelectedRoleId] = useState("")
  const { data, loading, error } = useQuery(GetAllRoles)

  async function handleSubmit(e){
    e.preventDefault();
    try {
      if(isLogin){
        const loginData = await loginAction({ 
            variables: { 
                input:{
                  email: formData.email, 
                  password: formData.password
                } 
            } 
        })

        const token = loginData.data.login
        localStorage.setItem('token', token)

        setToken(token)
        setFormData({...formData, email: '', password: ''})
      } else {
        const registerData = await registerAction({ 
            variables: { 
                input:{
                  firstName: formData.firstName, 
                  lastName: formData.lastName, 
                  email: formData.email, 
                  password: formData.password, 
                  roleId: Number(selectedRoleId)
                }
            } 
        })

        const user = registerData.data.register
        localStorage.setItem('user', JSON.stringify(user))

        setUser(user)
        setFormData({ firstName: '', lastName: '', email: '', password: '', roleId: null })
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Authentication failed:", error.message);
      alert(`Authentication failed: ${error.message}`)
    }
  }

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: "6px",
  }
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
  }

  return (
    <div className="authContainer"> 
      { isLogin ? (
        <div className="authCard">
          <h1>Sign In</h1>
          <form className="authForm" onSubmit={(e) => handleSubmit(e)}>
            <input type="email" placeholder='Email' 
            value={formData.email} 
            onChange={(e)=>setFormData({...formData, email: e.target.value})}
            />
            <input type="password" placeholder='Password' 
            value={formData.password} 
            onChange={(e)=>setFormData({...formData, password: e.target.value})}
            />
            <h3 className="toggleText" onClick={()=>setIsLogin(false)}>Create Account?</h3>
            <button className="submitBtn" type="submit">Sign In</button>
          </form>
        </div>
      ) : (
        <div className="authCard">
          <h2>Sign Up</h2>
          <form className="authForm" onSubmit={(e) => handleSubmit(e)}>
            <input type="text" placeholder='First Name' 
            value={formData.firstName} 
            onChange={(e)=>setFormData({...formData, firstName: e.target.value})}
            />
            <input type="text" placeholder='Last Name' 
            value={formData.lastName} 
            onChange={(e)=>setFormData({...formData, lastName: e.target.value})}
            />
            <input type="email" placeholder='Email' 
            value={formData.email} 
            onChange={(e)=>setFormData({...formData, email: e.target.value})}
            />
            <input type="password" placeholder='Password' 
            value={formData.password} 
            onChange={(e)=>setFormData({...formData, password: e.target.value})}
            />
            <div>
              <label style={labelStyle}>Role</label>
              <select
                name="role"
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                style={inputStyle}
                required
              >
              <option value="">Select Role</option>
                {data?.getAllRoles?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>
            <h3 className="toggleText" onClick={()=>setIsLogin(true)}>Already have an account? Login</h3>
            <button className="submitBtn" type="submit">Sign Up</button>
          </form>
        </div>
      ) }
    </div>
  )
}

export default SignIn
