import React from 'react'
import { useForm } from 'react-hook-form';

const FirstSignupmodal = ({isSignup , setIsSignup}) => {

     const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
      

  return (
    <>
    {isSignup &&
    <div  className="bg-black/80  p-6 rounded-lg shadow-md space-y-4 inset-0 fixed flex items-center justify-center  backdrop-blur-sm " >
    <form onSubmit={handleSubmit((data) => { 
        console.log(data);
        reset();
        })} className="bg-white p-6 rounded-lg m-auto shadow-md space-y-4 ">
        <div>
            <label htmlFor="username">Username</label>
            <input
                id="username"
                {...register("username", { required: "Username is required" })}
            />
            {errors.username && <p>{errors.username.message}</p>}
        </div>

        <button onClick={()=>setIsSignup(false)}>X</button>
        <div>
            <label htmlFor="email">Email</label>
            <input
                id="email"
                type="email"
                {...register("email", { 
                    required: "Email is required", 
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address"
                    }
                })}
            />
           {errors.email && <p>{errors.email?.message }</p>}
        </div>
        <div>
            <label htmlFor="password">Password</label>
            <input
                id="password"
                type="password"
                {...register("password", { 
                    required: "Password is required", 
                    minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                    }
                })}
            />
            {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit">Sign Up</button>
    </form>
    </div>}

    </>
    
  )
}

export default FirstSignupmodal