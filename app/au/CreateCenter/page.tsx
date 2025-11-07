"use client";

import { Formik, Form, Field, FieldProps } from "formik";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BD_DIVISIONS } from "@/types/shakib/authority.const";
import { CENTER_STATUS } from "@/constants/shakib/center.const";
import { ICenterProfile } from "@/models/center.model";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const validationSchema = yup.object({
  centerName: yup.string().required("Center name is required"),
  licenseNumber: yup.string(),
  address: yup.object({
    division: yup
      .string()
      .oneOf(BD_DIVISIONS as readonly string[], "Invalid division")
      .required("Division is required"),
    district: yup.string().required("District is required"),
    upazila: yup.string(),
    detail: yup.string(),
  }),
  contactPhone: yup.string().matches(/^[0-9+\-\s()]+$/, "Invalid phone number"),
  capacityPerSlot: yup
    .number()
    .min(1, "Capacity must be at least 1")
    .integer("Capacity must be a whole number"),
  vaccineTypes: yup.array().of(yup.string()),
  geo: yup.object({
    type: yup.string().oneOf(["Point"]),
    coordinates: yup
      .array()
      .of(yup.number())
      .length(2, "Coordinates must be [longitude, latitude]"),
  }),
  status: yup
    .string()
    .oneOf(Object.values(CENTER_STATUS) as readonly string[], "Invalid status"),
});


export default function CreateCenter() {
  // const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    centerName: "",
    licenseNumber: "",
    address: {
      division: "" as "" | (typeof BD_DIVISIONS)[number],
      district: "",
      upazila: "",
      detail: "",
    },
    contactPhone: "",
    capacityPerSlot: 50,
    vaccineTypes: [],
    geo: {
      type: "Point",
      coordinates: [0, 0],
    },
    status: CENTER_STATUS.ACTIVE,
    isVerified: false,
  };

  const printFormData = (values: typeof initialValues) => {
    console.log("=".repeat(60));
    console.log("FORM SUBMISSION DATA");
    console.log("=".repeat(60));
    console.log("\n📋 Center Information:");
    console.log(`  Center Name: ${values.centerName || "(empty)"}`);
    console.log(`  License Number: ${values.licenseNumber || "(empty)"}`);
    console.log(`  Status: ${values.status}`);
    console.log(`  Capacity Per Slot: ${values.capacityPerSlot}`);
    console.log(`  Contact Phone: ${values.contactPhone || "(empty)"}`);
    
    console.log("\n📍 Address Information:");
    console.log(`  Division: ${values.address.division || "(empty)"}`);
    console.log(`  District: ${values.address.district || "(empty)"}`);
    console.log(`  Upazila: ${values.address.upazila || "(empty)"}`);
    console.log(`  Detailed Address: ${values.address.detail || "(empty)"}`);
    
    console.log("\n💉 Vaccine Information:");
    console.log(`  Vaccine Types: ${values.vaccineTypes.length > 0 ? values.vaccineTypes.join(", ") : "(none)"}`);
    
    console.log("\n🗺️  Geographic Location:");
    console.log(`  Type: ${values.geo.type}`);
    console.log(`  Coordinates: [${values.geo.coordinates[0]}, ${values.geo.coordinates[1]}]`);
    console.log(`  Longitude: ${values.geo.coordinates[0]}`);
    console.log(`  Latitude: ${values.geo.coordinates[1]}`);
    
    console.log("\n📊 Additional Information:");
    console.log(`  Is Verified: ${values.isVerified}`);
    
    console.log("\n" + "=".repeat(60));
    console.log("Complete Form Data Object:");
    console.log(JSON.stringify(values, null, 2));
    console.log("=".repeat(60) + "\n");
  };

  const handleSubmit = async (values: typeof initialValues) => {
    // Print all form inputs
    printFormData(values);

    // if (!session?.user) {
    //   const errorMsg = "You must be logged in to create a center";
    //   setError(errorMsg);
    //   toast.error("Authentication Required", {
    //     description: errorMsg,
    //   });
    //   return;
    // }

    // Validate division is selected
    if (!values.address.division) {
      const errorMsg = "Please select a division";
      setError(errorMsg);
      toast.error("Validation Error", {
        description: errorMsg,
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Show loading toast
    const loadingToast = toast.loading("Creating center...", {
      description: "Please wait while we process your request",
    });

    try {
      // Prepare data for submission - ensure division is properly typed
      const submitData: Omit<ICenterProfile, "userId" | "isDeleted" | "deletedAt" | "deletedBy"> = {
        ...values,
        address: {
          ...values.address,
          division: values.address.division as (typeof BD_DIVISIONS)[number],
        },
        geo: {
          type: "Point" as const,
          coordinates: [values.geo.coordinates[0] || 0, values.geo.coordinates[1] || 0] as [number, number],
        },
      };

      // Call the API endpoint
      const response = await axios.post("/api/mashiat/createCenter", {
        ...submitData,
        userId: "1233455555555555555555555555"
      });

      if (response.data.success) {
        // Dismiss loading toast
        toast.dismiss(loadingToast);

        // Show success toast
        toast.success("Center Created Successfully!", {
          description: `"${response.data.data?.centerName || values.centerName}" has been registered successfully.`,
          duration: 4000,
        });

        // Redirect after a short delay to allow user to see the success message
        setTimeout(() => {
          router.push("/au/dashboard");
        }, 1500);
      } else {
        // Dismiss loading toast
        toast.dismiss(loadingToast);

        const errorMsg = response.data.error || "Failed to create center";
        setError(errorMsg);
        toast.error("Failed to Create Center", {
          description: errorMsg,
          duration: 5000,
        });
      }
    } catch (err) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      let errorMsg = "An unexpected error occurred";
      
      if (axios.isAxiosError(err)) {
        // Handle different error status codes
        if (err.response) {
          const status = err.response.status;
          errorMsg = err.response.data?.error || err.response.data?.message || "Failed to create center";

          if (status === 401) {
            toast.error("Authentication Failed", {
              description: "Please log in again to continue",
              duration: 5000,
            });
          } else if (status === 403) {
            toast.error("Access Denied", {
              description: "You don't have permission to perform this action",
              duration: 5000,
            });
          } else if (status === 409) {
            toast.error("Center Already Exists", {
              description: errorMsg,
              duration: 5000,
            });
          } else if (status === 400) {
            toast.error("Validation Error", {
              description: errorMsg,
              duration: 5000,
            });
          } else {
            toast.error("Failed to Create Center", {
              description: errorMsg,
              duration: 5000,
            });
          }
        } else if (err.request) {
          errorMsg = "Network error. Please check your connection and try again.";
          toast.error("Network Error", {
            description: errorMsg,
            duration: 5000,
          });
        } else {
          toast.error("Request Error", {
            description: errorMsg,
            duration: 5000,
          });
        }
      } else {
        toast.error("Unexpected Error", {
          description: errorMsg,
          duration: 5000,
        });
      }

      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Vaccination Center</h1>
        <p className="text-muted-foreground mt-2">
          Register a new vaccination center with all required information
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="space-y-6">
            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Center Name */}
            <div className="space-y-2">
              <label htmlFor="centerName" className="text-sm font-medium">
                Center Name <span className="text-destructive">*</span>
              </label>
              <Field name="centerName">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    id="centerName"
                    placeholder="Enter center name"
                    className={errors.centerName && touched.centerName ? "border-destructive" : ""}
                  />
                )}
              </Field>
              {errors.centerName && touched.centerName && (
                <p className="text-sm text-destructive">{errors.centerName}</p>
              )}
            </div>

            {/* License Number */}
            <div className="space-y-2">
              <label htmlFor="licenseNumber" className="text-sm font-medium">
                License Number
              </label>
              <Field name="licenseNumber">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    id="licenseNumber"
                    placeholder="Enter license number (optional)"
                  />
                )}
              </Field>
              {errors.licenseNumber && touched.licenseNumber && (
                <p className="text-sm text-destructive">{errors.licenseNumber}</p>
              )}
            </div>

            {/* Address Section */}
            <div className="rounded-lg border p-6 space-y-4">
              <h2 className="text-lg font-semibold">Address Information</h2>

              {/* Division */}
              <div className="space-y-2">
                <label htmlFor="address.division" className="text-sm font-medium">
                  Division <span className="text-destructive">*</span>
                </label>
                <Field name="address.division">
                  {({ field }: FieldProps) => (
                    <select
                      {...field}
                      id="address.division"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select Division</option>
                      {BD_DIVISIONS.map((division) => (
                        <option key={division} value={division}>
                          {division}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                {errors.address?.division && touched.address?.division && (
                  <p className="text-sm text-destructive">{errors.address.division}</p>
                )}
              </div>

              {/* District */}
              <div className="space-y-2">
                <label htmlFor="address.district" className="text-sm font-medium">
                  District <span className="text-destructive">*</span>
                </label>
                <Field name="address.district">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      id="address.district"
                      placeholder="Enter district name"
                      className={
                        errors.address?.district && touched.address?.district
                          ? "border-destructive"
                          : ""
                      }
                    />
                  )}
                </Field>
                {errors.address?.district && touched.address?.district && (
                  <p className="text-sm text-destructive">{errors.address.district}</p>
                )}
              </div>

              {/* Upazila */}
              <div className="space-y-2">
                <label htmlFor="address.upazila" className="text-sm font-medium">
                  Upazila
                </label>
                <Field name="address.upazila">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      id="address.upazila"
                      placeholder="Enter upazila name (optional)"
                    />
                  )}
                </Field>
              </div>

              {/* Detail Address */}
              <div className="space-y-2">
                <label htmlFor="address.detail" className="text-sm font-medium">
                  Detailed Address
                </label>
                <Field name="address.detail">
                  {({ field }: FieldProps) => (
                    <textarea
                      {...field}
                      id="address.detail"
                      placeholder="Enter detailed address (optional)"
                      rows={3}
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  )}
                </Field>
              </div>
            </div>

            {/* Contact & Capacity Section */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Contact Phone */}
              <div className="space-y-2">
                <label htmlFor="contactPhone" className="text-sm font-medium">
                  Contact Phone
                </label>
                <Field name="contactPhone">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      id="contactPhone"
                      type="tel"
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  )}
                </Field>
                {errors.contactPhone && touched.contactPhone && (
                  <p className="text-sm text-destructive">{errors.contactPhone}</p>
                )}
              </div>

              {/* Capacity Per Slot */}
              <div className="space-y-2">
                <label htmlFor="capacityPerSlot" className="text-sm font-medium">
                  Capacity Per Slot
                </label>
                <Field name="capacityPerSlot">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      id="capacityPerSlot"
                      type="number"
                      min="1"
                      placeholder="50"
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setFieldValue("capacityPerSlot", value);
                      }}
                    />
                  )}
                </Field>
                {errors.capacityPerSlot && touched.capacityPerSlot && (
                  <p className="text-sm text-destructive">{errors.capacityPerSlot}</p>
                )}
              </div>
            </div>

            {/* Vaccine Types */}
            <div className="space-y-2">
              <label htmlFor="vaccineTypes" className="text-sm font-medium">
                Vaccine Types (comma-separated)
              </label>
              <Field name="vaccineTypes">
                {({ field }: FieldProps) => (
                  <Input
                    id="vaccineTypes"
                    placeholder="e.g., Covishield, Pfizer, Moderna"
                    value={
                      Array.isArray(field.value) ? field.value.join(", ") : field.value || ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const types = value
                        .split(",")
                        .map((t) => t.trim())
                        .filter((t) => t.length > 0);
                      setFieldValue("vaccineTypes", types);
                    }}
                  />
                )}
              </Field>
              {errors.vaccineTypes && touched.vaccineTypes && (
                <p className="text-sm text-destructive">{String(errors.vaccineTypes)}</p>
              )}
            </div>

            {/* Geographic Coordinates */}
            <div className="rounded-lg border p-6 space-y-4">
              <h2 className="text-lg font-semibold">Geographic Location (Optional)</h2>
              <p className="text-sm text-muted-foreground">
                Enter coordinates for map display: [Longitude, Latitude]
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="geo.coordinates.0" className="text-sm font-medium">
                    Longitude
                  </label>
                  <Field name="geo.coordinates.0">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        id="geo.coordinates.0"
                        type="number"
                        step="any"
                        placeholder="90.0000"
                        onChange={(e) => {
                          const lng = parseFloat(e.target.value) || 0;
                          setFieldValue("geo.coordinates.0", lng);
                        }}
                      />
                    )}
                  </Field>
                </div>
                <div className="space-y-2">
                  <label htmlFor="geo.coordinates.1" className="text-sm font-medium">
                    Latitude
                  </label>
                  <Field name="geo.coordinates.1">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        id="geo.coordinates.1"
                        type="number"
                        step="any"
                        placeholder="23.0000"
                        onChange={(e) => {
                          const lat = parseFloat(e.target.value) || 0;
                          setFieldValue("geo.coordinates.1", lat);
                        }}
                      />
                    )}
                  </Field>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Field name="status">
                {({ field }: FieldProps) => (
                  <select
                    {...field}
                    id="status"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {Object.values(CENTER_STATUS).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              {errors.status && touched.status && (
                <p className="text-sm text-destructive">{errors.status}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1 md:flex-none">
                {isSubmitting ? "Creating..." : "Create Center"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

