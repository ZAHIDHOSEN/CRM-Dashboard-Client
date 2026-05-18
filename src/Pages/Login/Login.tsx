/* eslint-disable @typescript-eslint/no-explicit-any */



export default function Login() {
 
    const handleLogin = async(e:any)=>{
        e.preventDefault()

        const name = e.target.name.value;
        const email = e.target.email.value;
        console.log({name,email})
    }

    
  return (
    <div>
    <h3 className="text-3xl font-bold text-center">Login</h3>

     {/* form */}
     <div className="flex justify-center items-center h-screen">
     <form onSubmit={handleLogin}  className="border border-red-500">
        <div className="flex flex-col gap-2">
      <label>Name</label>
         <input type="text" className="border border-gray-300 rounded-sm w-96 h-10"
           placeholder=" name" name="name"/>
       <label>Email</label>
         <input type="email" className="border border-gray-300 rounded-sm w-96 h-10"
           placeholder=" example@gmail.com" name="email"/>
        </div>
        <button type="submit" className="w-96 h-10 bg-black text-white rounded-sm my-2">Login</button>
     </form>
     </div>
   
    </div>
  )
}
