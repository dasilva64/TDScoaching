import React, { useEffect, useState } from "react";

interface Proptype {
    message: string
}

const Flash = ({message}: Proptype) => {
  const [visibility, setVisibility] = useState<boolean>(true);
  useEffect(() => {
     setTimeout(() => {
    setVisibility(false);
  }, 10000);
  }, [])
 
  return <>{visibility && <div>{message}</div>}</>;
};

export default Flash;
