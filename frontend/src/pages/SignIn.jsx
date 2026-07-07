import React, { useContext, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { Login, Register } from '../graphql/mutations'
import { AuthContext } from '../context/AuthContext'
import './SignIn.css'

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', role: '' })
  
  const { setToken, setUser } = useContext(AuthContext);
  const [loginAction] = useMutation(Login)
  const [registerAction] = useMutation(Register)

  async function handleSubmit(e){
    e.preventDefault();
    try {
      if(isLogin){
        const loginData = await loginAction({ 
            variables: { 
                email: formData.email, 
                password: formData.password 
            } 
        })

        const token = loginData.data.login
        localStorage.setItem('token', token)

        setToken(token)
        setFormData({...formData, email: '', password: ''})
      } else {
        const registerData = await registerAction({ 
            variables: { 
                firstName: formData.firstName, 
                lastName: formData.lastName, 
                email: formData.email, 
                password: formData.password, 
                role: formData.role 
            } 
        })

        const user = registerData.data.register
        localStorage.setItem('user', JSON.stringify(user))

        setUser(user)
        setFormData({ firstName: '', lastName: '', email: '', password: '', role: '' })
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Authentication failed:", error.message);
      alert(`Authentication failed: ${error.message}`)
    }
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
            <input type="text" placeholder='Role' 
            value={formData.role} 
            onChange={(e)=>setFormData({...formData, role: e.target.value})}
            />
            <h3 className="toggleText" onClick={()=>setIsLogin(true)}>Already have an account? Login</h3>
            <button className="submitBtn" type="submit">Sign Up</button>
          </form>
        </div>
      ) }
    </div>
  )
}

export default SignIn
