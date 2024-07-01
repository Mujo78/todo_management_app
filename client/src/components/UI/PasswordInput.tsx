import { useState } from "react";
import { RemoveRedEye, VisibilityOff } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues, unknown>;
  name: Path<TFieldValues>;
  defaultValue: PathValue<TFieldValues, Path<TFieldValues>> | undefined;
  error: boolean | undefined;
  children?: React.ReactNode;
  label?: string;
  errorMessage: string | undefined;
};

const PasswordInput = <TFieldValues extends FieldValues>({
  control,
  error,
  children,
  defaultValue,
  errorMessage,
  label = "Password",
  name,
}: Props<TFieldValues>) => {
  const [toggle, setToggle] = useState<boolean>(false);

  const handleToggle = () => {
    setToggle((toggle) => !toggle);
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          {...field}
          variant="outlined"
          label={label}
          required
          type={toggle ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{ cursor: "pointer" }}
                onClick={handleToggle}
              >
                {toggle ? <RemoveRedEye /> : <VisibilityOff />}
              </InputAdornment>
            ),
          }}
          fullWidth
          error={error}
          helperText={errorMessage ? errorMessage : children ? children : ""}
        />
      )}
    />
  );
};

export default PasswordInput;
