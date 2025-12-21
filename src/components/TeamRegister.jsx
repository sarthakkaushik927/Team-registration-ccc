import React, { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Facebook, Linkedin, Instagram, Plus, Trash2, Users, User, CheckCircle, XCircle } from 'lucide-react';

// COMPONENTS
import { NetworkBackground } from './NetworkBackground';
import { SplashScreen } from './SplashScreen';
import { FormInput, FormSelect } from './FormComponents';
import ChaosOrbCursor from './ChaosOrbCursor';

// CONFIG
const branches = ['CSE', 'CSE (AIML)', 'CSE (DS)', 'AIML', 'CS', 'CS (H)', 'IT', 'CSIT', 'ECE', 'EEE', 'Civil', 'Mechanical'];
const genders = ['Male', 'Female', 'Other'];

// SCHEMA
const memberSchema = z.object({
  fullName: z.string().min(3, "Too short"),
  collegeEmail: z.string().email("Invalid email").endsWith("@akgec.ac.in", "Must be @akgec.ac.in"),
  gender: z.enum(genders, { required_error: "Required" }),
  branch: z.enum(branches, { required_error: "Required" }),
  studentNumber: z.string().regex(/^\d+$/, "Numbers only").min(7, "Invalid"),
  unstopId: z.string().min(1, "Required"),
  residenceAddress: z.object({
    street: z.string().min(1, "Required"),
    city: z.string().min(1, "Required"),
    state: z.string().min(1, "Required"),
    pincode: z.string().min(6, "Invalid"),
    country: z.string().default("India")
  })
});

const teamSchema = z.object({
  teamName: z.string().min(3, "Too short"),
  members: z.array(memberSchema).min(2, "Min 2 members").max(4, "Max 4 members")
});

export default function TeamRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isTeamNameAvailable, setIsTeamNameAvailable] = useState(null); 
  const recaptchaRef = useRef(null);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(teamSchema),
    mode: 'onChange',
    defaultValues: {
      teamName: "",
      members: [
        { residenceAddress: { country: "India" } },
        { residenceAddress: { country: "India" } }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "members" });

  const checkTeamName = async (name) => {
    setIsTeamNameAvailable(null);

    if (!name || name.length < 3) return;
    
    try {
      // FIXED: Using relative path to trigger Vite Proxy
      const res = await axios.get(`/api/check/team?teamName=${name}`);
      
      if (res.data && res.data.success) {
        setIsTeamNameAvailable(res.data.available);
      }
    } catch (error) {
      console.warn("Team Check Failed (likely network error or CORS):", error);
      // Leave as null so we don't block the user
      setIsTeamNameAvailable(null);
    }
  };

  const onSubmit = async (data) => {
    if (isTeamNameAvailable === false) { 
        toast.error("Team name is already taken"); 
        return; 
    }
    
    setIsLoading(true);
    try {
      // 1. EXECUTE INVISIBLE RECAPTCHA
      let token = "";
      try {
        // This will fail on localhost with your production key, so we catch it
        token = await recaptchaRef.current.executeAsync();
      } catch (captchaError) {
        console.warn("Captcha execution warning (Ignore on Localhost):", captchaError);
        // We continue without a token on localhost so you can at least test the API connection
      }

      // 2. PREPARE DATA
      const apiData = {
          ...data,
          members: data.members.map(m => ({
              ...m,
              personalEmail: m.collegeEmail,
              hackerRankUrl: "https://hackerrank.com/placeholder"
          }))
      };

      // 3. SEND TO API
      // FIXED: Using relative path to trigger Vite Proxy
      await axios.post('/api/register', 
        { ...apiData, captchaToken: token }, 
        { headers: { 'Content-Type': 'application/json' } }
      );

      toast.success("Registered Successfully!");
      if(recaptchaRef.current) recaptchaRef.current.reset(); 
      setTimeout(() => window.location.reload(), 2000);
      
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'Registration Failed';
      toast.error(msg);
      if(recaptchaRef.current) recaptchaRef.current.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans bg-[#000000] text-white selection:bg-blue-500/30">
      <ChaosOrbCursor />
      <div className="fixed inset-0 z-0"><NetworkBackground /></div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {!showSplash && (
        <div className="relative z-10 flex flex-col min-h-screen">
          <div className="flex flex-col lg:flex-row flex-grow w-full">
            
            {/* LEFT INFO */}
            <div className="w-full lg:w-1/3 relative hidden lg:block">
              <div className="sticky top-0 h-screen flex flex-col items-center justify-center p-12">
                 <div className="text-center p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5">
                    <img src="/cccLogo.png" alt="CCC" className="w-16 h-16 mx-auto mb-4 object-contain" />
                    <h1 className="text-5xl font-bold mb-2">Team <br/><span className="text-[#00aaff]">Registration</span></h1>
                    <p className="text-gray-400 mb-8">Gather your squad.</p>
                    <div className="flex flex-col gap-4 text-left bg-black/40 p-6 rounded-xl border border-blue-500/20">
                        <div className="flex items-center gap-3"><Users className="text-[#00aaff]" /><div><p className="text-xs text-gray-400">Team Size</p><p className="font-bold">2 - 4 Members</p></div></div>
                        <div className="w-full h-px bg-white/10"></div>
                        <div className="flex items-center gap-3"><CheckCircle className="text-[#00aaff]" /><div><p className="text-xs text-gray-400">Eligibility</p><p className="font-bold">All Branches</p></div></div>
                    </div>
                 </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="w-full lg:w-2/3 p-4 lg:p-12 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    <div className="lg:hidden text-center mb-8 flex flex-col items-center">
                        <img src="/cccLogo.png" className="w-12 h-12 mb-2"/>
                        <h1 className="text-3xl font-bold">Team Registration</h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
                        <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-blue-500/50 to-transparent">
                            <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-[#00aaff]" /> Team Details</h2>
                                <div className="relative">
                                    <FormInput 
                                        name="teamName" 
                                        type="text" 
                                        placeholder="Enter Team Name" 
                                        register={register} 
                                        error={errors.teamName} 
                                        onBlur={(e) => checkTeamName(e.target.value)} 
                                    />
                                    <div className="absolute right-4 top-3 text-sm">
                                        {isTeamNameAvailable === true && <span className="text-green-400 flex items-center gap-1"><CheckCircle size={14}/> Available</span>}
                                        {isTeamNameAvailable === false && <span className="text-red-400 flex items-center gap-1"><XCircle size={14}/> Taken</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {fields.map((field, index) => (
                                <motion.div key={field.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent">
                                    <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><User className="w-4 h-4 text-blue-400" /> {index === 0 ? "Team Leader" : `Member ${index + 1}`}</h3>
                                            {index > 1 && (<button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>)}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormInput name={`members.${index}.fullName`} placeholder="Full Name" register={register} error={errors?.members?.[index]?.fullName} type="text" />
                                            <FormInput name={`members.${index}.studentNumber`} placeholder="Student No." register={register} error={errors?.members?.[index]?.studentNumber} type="text" />
                                            <div className="md:col-span-2">
                                                <FormInput name={`members.${index}.collegeEmail`} placeholder="College Email (@akgec.ac.in)" register={register} error={errors?.members?.[index]?.collegeEmail} type="email" />
                                            </div>
                                            <div className="z-[50] relative"><FormSelect name={`members.${index}.gender`} placeholder="Gender" setValue={setValue} watch={watch} options={genders} error={errors?.members?.[index]?.gender} /></div>
                                            <div className="z-[50] relative"><FormSelect name={`members.${index}.branch`} placeholder="Branch" setValue={setValue} watch={watch} options={branches} error={errors?.members?.[index]?.branch} /></div>
                                            <div className="md:col-span-2">
                                                <FormInput name={`members.${index}.unstopId`} placeholder="Unstop ID" register={register} error={errors?.members?.[index]?.unstopId} type="text" />
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Address</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="md:col-span-2"><FormInput name={`members.${index}.residenceAddress.street`} placeholder="Street" register={register} error={errors?.members?.[index]?.residenceAddress?.street} type="text" /></div>
                                                <FormInput name={`members.${index}.residenceAddress.city`} placeholder="City" register={register} error={errors?.members?.[index]?.residenceAddress?.city} type="text" />
                                                <FormInput name={`members.${index}.residenceAddress.state`} placeholder="State" register={register} error={errors?.members?.[index]?.residenceAddress?.state} type="text" />
                                                <FormInput name={`members.${index}.residenceAddress.pincode`} placeholder="Pincode" register={register} error={errors?.members?.[index]?.residenceAddress?.pincode} type="text" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {fields.length < 4 && (
                            <button type="button" onClick={() => append({ residenceAddress: { country: "India" } })} className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-gray-400 hover:text-white hover:border-[#00aaff] transition-all flex items-center justify-center gap-2"><Plus size={20} /> Add Member</button>
                        )}

                        <div className="flex flex-col items-center gap-6 pt-4">
                            {/* YOUR KEY - WILL SHOW 401 ON LOCALHOST BUT WORK ON PRODUCTION */}
                            <ReCAPTCHA 
                                ref={recaptchaRef} 
                                size="invisible"
                                sitekey="6LcexjIsAAAAAAAm8Lf6qmSz-YiDdormF-wcDDKM" 
                                theme="dark"
                            />
                            
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={isLoading} className="px-12 py-4 bg-gradient-to-r from-[#0066cc] to-[#00aaff] rounded-full font-bold text-lg tracking-wider shadow-lg text-white disabled:opacity-50">{isLoading ? "Registering..." : "COMPLETE REGISTRATION"}</motion.button>
                        </div>
                    </form>
                </div>
            </div>
          </div>

          <div className="w-full relative z-10 border-t border-blue-900/30 bg-black/60 backdrop-blur-md mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
              <div className="flex justify-center gap-6 mb-8 relative z-50">
                <a href="#"><Facebook className="w-8 h-8 text-gray-400 hover:text-[#00aaff]" /></a>
                <a href="#"><Linkedin className="w-8 h-8 text-gray-400 hover:text-[#00aaff]" /></a>
                <a href="#"><Instagram className="w-8 h-8 text-gray-400 hover:text-[#00aaff]" /></a>
              </div>
              <div className="w-full relative pt-10 pb-6 border-t border-white/10 flex flex-col items-center">
                <p className="font-serif text-sm tracking-[0.3em] text-white/80 mb-2 relative z-50">Think.Develop.Deploy</p>
                <div className="relative w-full h-40 flex flex-col items-center justify-start pt-4">
                    <div className="flex items-center gap-4 relative z-50">
                         <img src="/cccLogo.png" alt="CCC Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(0,170,255,0.5)]" />
                         <h1 className="text-2xl md:text-5xl font-bold text-center text-white tracking-widest drop-shadow-2xl">CLOUD COMPUTING CELL</h1>
                    </div>
                    {/* SPARKLES COMPONENT REMOVED TO PREVENT CRASH */}
                    <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full z-0 pointer-events-none">
                        <div className="absolute inset-0 w-full h-full bg-transparent [mask-image:radial-gradient(350px_200px_at_center,transparent_20%,white)]"></div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}