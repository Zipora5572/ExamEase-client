export default {
  detectLanguage: async (
    file: File
  ) => {
    const formData = new FormData();
    formData.append("file", file);

   
    try {
      const response = await fetch("http://localhost:5000/detect-language", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to detect language");
      }

      const data = await response.json();

      return {
        language: data.language,
      };
    } catch (error) {
      console.error("Error detecting language:", error);
      return {
        language: "unknown",
      };
    }
  },

  setLanguage: async (
    language: "english" | "hebrew"
  ): Promise<void> => {
    const payload = {
      language,
    };

    try {
      const response = await fetch("http://localhost:5000/set-language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to set language");
      }

      console.log("Language set successfully:", payload);
    } catch (error) {
      console.error("Error setting language:", error);
      throw error;
    }
  },
};
