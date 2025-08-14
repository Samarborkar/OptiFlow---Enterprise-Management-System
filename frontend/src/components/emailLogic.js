// emailLogic.js
export const sendEmail = async (email) => {
    let dataSend = {
      email: email,
    };
  
    try {
      const res = await fetch('http://localhost:4000/api/sendEmail', {
        method: "POST",
        body: JSON.stringify(dataSend),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
  
      if (res.status >= 200 && res.status < 300) {
        alert("Send Successfully!");
      } else {
        alert("Failed to send email!");
      }
    } catch (error) {
      console.error("Error while sending email:", error);
    }
  };
  