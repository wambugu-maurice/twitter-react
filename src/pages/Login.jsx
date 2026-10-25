import {
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'
import {  signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { auth } from '../../firebase'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosArrowRoundForward } from 'react-icons/io'

function Login() {
  const[userForm,setUserForm]=useState({
    email:"",
    password:"",
  })
  const[error,setError]=useState({})
  const[loading,setLoading]=useState(false)

  function handleFieldUpdate(e){
    const{name,value}=e.target;
    setUserForm((formInput)=>({
      ...formInput,[name]:value
    }))
    setError({})
  }

  const navigate = useNavigate()
  async function handLogin(e) {
    e.preventDefault();

    setLoading(true)

    const newErrors = {}
    const{email,password}=userForm;

    if(!email.trim()){
      newErrors.email = "Please enter your email"
    }
    if(!password.trim()){
      newErrors.password = "Please enter your password"
    }
    setError(newErrors)
    if(Object.keys(newErrors).length > 0) {
      setLoading(false)
      return
    }
    try {
      const userCredentials = await signInWithEmailAndPassword(auth,email,password);
      if(userCredentials.user){
        setUserForm({email:"",password1:"",password2:""})
        toast.success("Login in successful")
        navigate("/home")

      }  
      } catch (err) {
      setError({ general : err.message})
      
    }finally{
      setLoading(false)
    }
    
  }

  return (
    <section className="loginSection">
  <div className="loginDiv">
    <div className="formDiv">
      <div className="errorContainer">
        {error.general && (
          <p className="errorMsg">{error.general}</p>
        )}
      </div>

      <form onSubmit={handLogin}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={userForm.email}
            onChange={handleFieldUpdate}
          />
          <div className="errorContainer">
            {error.email && (
              <p className="errorMsg">{error.email}</p>
            )}
          </div>
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            value={userForm.password}
            onChange={handleFieldUpdate}
          />
          <div className="errorContainer">
            {error.password && (
              <p className="errorMsg">{error.password}</p>
            )}
          </div>
        </FormControl>
        <p>Don't have an account? <Link to='/signup'className='authLink'
         >Signup</Link></p>
        <button type="submit" disabled={loading}>
          {loading ? (
            "logining in..."
          ) : (
            <>
              <IoIosArrowRoundForward />
              Login
            </>
          )}
        </button>
      </form>
    </div>
      <div className="loginMsg">
      <h2>Login</h2>
      <p>See what has changed since you last logged in</p>
    </div>
  </div>
</section>
  )          
}
      
export default Login