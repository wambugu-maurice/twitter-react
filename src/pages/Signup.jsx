import {
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { auth, db } from '../../firebase'
import { doc, setDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosArrowRoundForward } from 'react-icons/io'


function Signup() {
  const[userForm,setUserForm]=useState({
    name:"",
    email:"",
    password1:"",
    password2:""
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
  async function handleSignup(e) {
    e.preventDefault();

    setLoading(true)

    const newErrors = {}
    const{email,password1,password2,name}=userForm;

    if(!email.trim()){
      newErrors.email = "Please enter your email"
    }
    if(!password1.trim()){
      newErrors.password1 = "Please enter your password"
    }
    if(!password2.trim()){
      newErrors.password2 = "Please confirm your password"
    }
    if(!name.trim()){
      newErrors.name = "Please enter your username"
    }
    if(password1 !== password2){
      newErrors.password2 = "Passwords do not match"
    }
    setError(newErrors)
    if(Object.keys(newErrors).length > 0) {
      setLoading(false)
      return
    }
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth,email,password1);
      if(userCredentials.user){
        const newUser = {
          name,
          email,
          registeredOn: userCredentials.user.metadata.creationTime,
          userId: userCredentials.user.uid
        };

        const docRef = doc(db,"users",userCredentials.user.uid)
        await setDoc(docRef,newUser)
        setUserForm({username:"",email:"",password1:"",password2:""})
        toast.success("Account created")
        navigate("/home")
      }
      
    } catch (err) {
      setError({ general : err.message})
      
    }finally{
      setLoading(false)
    }
    
  }
  return (
    
<section className="signupSection">
  <div className="signupDiv">
    <div className="signupMsg">
      <h2>Create account</h2>
      <p>Your social life starts here. Create an account to explore</p>
    </div>

    <div className="formDiv">
      <div className="errorContainer">
        {error.general && (
          <p className="errorMsg">{error.general}</p>
        )}
      </div>

      <form onSubmit={handleSignup}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            name="name"
            value={userForm.name}
            onChange={handleFieldUpdate}
          />
          <div className="errorContainer">
            {error.name && (
              <p className="errorMsg">{error.name}</p>
            )}
          </div>
        </FormControl>

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
            name="password1"
            value={userForm.password1}
            onChange={handleFieldUpdate}
          />
          <div className="errorContainer">
            {error.password1 && (
              <p className="errorMsg">{error.password1}</p>
            )}
          </div>
        </FormControl>

        <FormControl>
          <FormLabel>Confirm password</FormLabel>
          <Input
            type="password"
            name="password2"
            value={userForm.password2}
            onChange={handleFieldUpdate}
          />
          <div className="errorContainer">
            {error.password2 && (
              <p className="errorMsg">{error.password2}</p>
            )}
          </div>
        </FormControl>
        <p>Already have an account? <Link to='/login'className='authLink'
         >Login</Link></p>
        <button type="submit" disabled={loading}>
          {loading ? (
            "Creating account..."
          ) : (
            <>
              <IoIosArrowRoundForward />
              Create account
            </>
          )}
        </button>
      </form>
    </div>
  </div>
</section>

  )
}

export default Signup