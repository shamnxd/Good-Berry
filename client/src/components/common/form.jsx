import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText, formType, errors = {} }) {
  function renderInputByComponentType(controlItem) {
    const value = formData[controlItem.name] || "";
    const hasError = !!errors[controlItem.name];

    switch (controlItem.componentType) {
      case "input":
        return (
          <Input
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type}
            value={value}
            className={hasError ? "border-red-500 focus-visible:ring-red-500" : ""}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
          />
        );

      case "select":
        return (
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, [controlItem.name]: value })
            }
            value={value}
          >
            <SelectTrigger className={`w-full ${hasError ? "border-red-500" : ""}`}>
              <SelectValue placeholder={controlItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {controlItem.options && controlItem.options.length > 0 ? (
                controlItem.options.map((optionItem) => (
                  <SelectItem key={optionItem.value} value={optionItem.value}>
                    {optionItem.label}
                  </SelectItem>
                ))
              ) : null}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            value={value}
            className={hasError ? "border-red-500 focus-visible:ring-red-500" : ""}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
          />
        );

      default:
        return (
          <Input
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type}
            value={value}
            className={hasError ? "border-red-500 focus-visible:ring-red-500" : ""}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
          />
        );
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((control) => (
          <div className="grid w-full gap-1.5" key={control.name}>
            <Label className="mb-1" htmlFor={control.name}>
              {control.label}
            </Label>
            {renderInputByComponentType(control)}
            {errors[control.name] && (
              <p className="text-[11px] text-red-500 font-medium ml-1">
                {errors[control.name]}
              </p>
            )}
          </div>
        ))}
      </div>
      {formType === "login" && (
        <Link to="/auth/login/forgot-password">
        <p className="text-sm text-primary text-end mt-3">Forgot password?</p>
        </Link>
      )}
      <Button type="submit" className="mt-4 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
