/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";


export default function Register() {
  
 
  const [organizations, setOrganizations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organization: "",
  });



  useEffect(() => {

    const fetchOrganizations = async () => {

      const res = await fetch(
        "http://localhost:5000/api/v1/organizations"
      );

      const data = await res.json();

      setOrganizations(data.data);
    };

    fetchOrganizations();

  }, []);




  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };




  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

 
  };

  return (
       <div className="min-h-screen flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 border p-6 rounded-lg"
      >

        <h2 className="text-2xl font-bold text-center">
          Register
        </h2>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <select
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >

          <option value="">
            Select Organization
          </option>

          {organizations.map((org: any) => (
            <option key={org._id} value={org._id}>
              {org.name}
            </option>
          ))}
        </select>




        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded"
        >
          Register
        </button>
      </form>
    </div>
  )
}
