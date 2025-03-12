"use client";

import { uploadStayImage } from "@/appwrite/propertyStorage";
import createProperty from "@/appwrite/properties";
import { getUser } from "@/appwrite/users";
import { userContext } from "@/context/UserContext";
import { useContext, useState } from "react";
import { FiMapPin, FiUpload } from "react-icons/fi";
import Loader from "@/components/Loader"; // Import Loader component

export default function UploadProperty() {
  const [formData, setFormData] = useState({
    location: "",
    city: "",
    coordinates: [] as number[],
    securityDeposit: "",
    monthlyRent: "",
    facilities: [] as string[],
  });

  const ctx = useContext(userContext);
  const [errors, setErrors] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // Loading state

  if (!ctx) return;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleListChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, facilities: e.target.value.split(",") });
  };

  const fetchCoordinates = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            coordinates: [latitude, longitude],
          }));
        },
        (error) => console.error("Error getting location:", error)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    setLoading(true); // Set loading to true

    if (!ctx?.user?.email) return;

    try {
      // Fetch host ID
      const host = await getUser(ctx.user?.email);
      if (!host?.data?.$id) {
        setErrors("Host ID is required.");
        setLoading(false);
        return;
      }
      const hostId = host.data.$id;

      // Validate required fields
      const requiredFields = ["location", "city", "monthlyRent"];
      for (let field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          setErrors(`Please fill in ${field}`);
          setLoading(false);
          return;
        }
      }

      if (formData.coordinates.length !== 2) {
        setErrors("Please fetch coordinates before submitting.");
        setLoading(false);
        return;
      }

      // Upload all images
      const uploadedImageIds: string[] = await Promise.all(
        selectedFiles.map(async (file) => {
          const response = await uploadStayImage(file);
          return response.status && response.data ? response.data.$id : null;
        })
      ).then((res) => res.filter((id) => id !== null) as string[]);

      setUploadedImages(uploadedImageIds);

      // Create property in Appwrite
      await createProperty({
        hostId,
        location: formData.location,
        city: formData.city,
        coordinates: formData.coordinates,
        securityDeposit: Number(formData.securityDeposit) || 0,
        monthlyRent: Number(formData.monthlyRent),
        images: uploadedImageIds,
        facilities: formData.facilities,
      });

      console.log("Property created successfully");
    } catch (error) {
      console.error("Failed to create property:", error);
      setErrors("Failed to create property. Try again.");
    } finally {
      setLoading(false); // Set loading to false after completion
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-2xl"
    >
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent ">
          <Loader />
        </div>
      )}{" "}
      {/* Show Loader when loading is true */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg bg-gray-800 border-gray-700"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg bg-gray-800 border-gray-700"
        />
      </div>
      <div className="mb-4 flex items-center gap-4">
        <button
          type="button"
          onClick={fetchCoordinates}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center"
        >
          <FiMapPin /> Fetch Coordinates
        </button>
        <span>
          {formData.coordinates.length === 2
            ? `Lat: ${formData.coordinates[0]}, Lng: ${formData.coordinates[1]}`
            : "Coordinates not set"}
        </span>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Security Deposit:</label>
        <input
          type="number"
          name="securityDeposit"
          value={formData.securityDeposit}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg bg-gray-800 border-gray-700"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Monthly Rent:</label>
        <input
          type="number"
          name="monthlyRent"
          value={formData.monthlyRent}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg bg-gray-800 border-gray-700"
        />
      </div>
      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Upload Images:</label>
        <label className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-gray-700 rounded-lg cursor-pointer">
          <FiUpload />
          <input
            type="file"
            multiple
            onChange={handleFileSelection}
            className="hidden"
          />
        </label>
        <div className="mt-2 text-sm">
          {selectedFiles.length} images selected
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">
          Facilities (comma-separated):
        </label>
        <input
          type="text"
          name="facilities"
          onChange={handleListChange}
          className="w-full p-2 border rounded-lg bg-gray-800 border-gray-700"
        />
      </div>
      {errors && <p className="text-red-500 text-sm mb-4">{errors}</p>}
      <button
        type="submit"
        disabled={loading}
        className={`w-full font-bold py-2 px-4 rounded-lg ${
          loading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {loading ? "Submitting..." : "Submit Property"}
      </button>
    </form>
  );
}
