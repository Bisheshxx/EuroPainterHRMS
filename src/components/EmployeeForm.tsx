import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { employeeSchema } from "@/schma/employee.schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { CookingPot } from "lucide-react";

const POSITIONS = ["Position 1", "Position 2"];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Temporary"];

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface IProps {
  handleSubmitForm: (data: EmployeeFormValues) => void;
  editingEmployee?: any;
  form: UseFormReturn<
    {
      name: string;
      address: string;
      email: string;
      phone: string;
      position: string;
      employment_type: string;
      status: string;
      payrate: string;
      start_date: string;
      notes?: string | undefined;
      job?: string | undefined;
    },
    any,
    {
      name: string;
      address: string;
      email: string;
      phone: string;
      position: string;
      employment_type: string;
      status: string;
      payrate: string;
      start_date: string;
      notes?: string | undefined;
      job?: string | undefined;
    }
  >;
  jobsList: { id: string; name: string }[];
}
export default function EmployeeForm({
  handleSubmitForm,
  editingEmployee,
  form,
  jobsList,
}: IProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  const [phoneDisplay, setPhoneDisplay] = useState("");

  useEffect(() => {
    if (editingEmployee) {
      setValue("name", editingEmployee.name || "");
      setValue("address", editingEmployee.address || "");
      setValue("email", editingEmployee.email || "");
      setValue("phone", editingEmployee.phone || "");
      setValue("position", editingEmployee.position || "");
      setValue("employment_type", editingEmployee.employment_type || "");
      setValue("status", editingEmployee.status || "");
      setValue(
        "payrate",
        editingEmployee.payrate != null
          ? editingEmployee.payrate.toString()
          : ""
      );
      setValue("start_date", editingEmployee.start_date);
      setValue("notes", editingEmployee.notes ?? "");
      setValue("job", editingEmployee.job || "");
    }
  }, []);

  // Sync display value with field value
  useEffect(() => {
    const value = form.getValues("phone") || "";
    let displayValue = value;
    if (value.startsWith("02") && value.length > 2) {
      displayValue = value
        .replace(/^(\d{2})(\d{3})(\d{0,4})/, "$1 $2 $3")
        .trim();
    } else if (value.startsWith("0") && value.length > 1) {
      displayValue = value
        .replace(/^(\d{2})(\d{3})(\d{0,4})/, "$1 $2 $3")
        .trim();
    }
    setPhoneDisplay(displayValue);
  }, [form.watch("phone")]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter full name" disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="employee@company.com"
                      required
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="021 234 5678"
                      onChange={e => {
                        // Remove all non-digit characters
                        let value = e.target.value.replace(/\D/g, "");
                        // Limit to 10 digits
                        value = value.slice(0, 10);
                        // Format for NZ numbers (simple version)
                        let displayValue = value;
                        if (value.startsWith("02") && value.length > 2) {
                          displayValue = value
                            .replace(/^(\d{2})(\d{3})(\d{0,4})/, "$1 $2 $3")
                            .trim();
                        } else if (value.startsWith("0") && value.length > 1) {
                          displayValue = value
                            .replace(/^(\d{2})(\d{3})(\d{0,4})/, "$1 $2 $3")
                            .trim();
                        }
                        setPhoneDisplay(displayValue);
                        field.onChange(value);
                      }}
                      value={phoneDisplay}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter employee address"
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map(position => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="employment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMPLOYMENT_TYPES.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AWAITINGVERIFICATION">
                          Awaiting Verification
                        </SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="TERMINATED">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="payrate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay Rate ($/hour)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="1"
                      placeholder="0.00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="job"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Job</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job assignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Job Assignment</SelectItem>
                      {jobsList.map(job => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Additional notes about the employee"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => reset()}>
            Cancel
          </Button>
          <Button type="submit">
            {editingEmployee ? "Update" : "Add"} Employee
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
