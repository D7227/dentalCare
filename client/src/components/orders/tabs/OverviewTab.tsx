import SummaryOrder from "@/components/order-wizard/SummaryOrder";
import React, { useEffect, useState } from "react";

const OverviewTab: React.FC<any> = ({ data }) => {
  const [formData, setFormData] = useState(data ?? []);
  useEffect(() => {
    setFormData(data);
  }, [data]);

  return (
    <>
      <SummaryOrder
        formData={formData}
        setFormData={setFormData}
        readMode={true}
      />
    </>
  );
};

export default OverviewTab;
