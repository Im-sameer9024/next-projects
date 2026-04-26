"use client"

import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";
import { Button } from "@/shared/components/ui/button";
import { Cross } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

const Home = () => {

  const{control} = useForm()

  return (
    <div>
      <h2 className="  ">
        <Button >
          Click me
        </Button>

        <CustomButton iconOnly leftIcon={<Cross/>}>
          
        </CustomButton>

        <CustomInput label="Password" type="password" name="password" control={control} />
      </h2>
    </div>
  );
};

export default Home;
