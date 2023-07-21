import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from '@hookform/devtools'
import { useEffect } from "react";

let renderCount = 0;
type FormValues = {
  username: string,
  email: string,
  channel: string,
  social: {
    twitter: string,
    facebook: string
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
}

export const YouTubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: ""
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date
    },
    mode: "onSubmit", //mode can be onSubmit,onChange,OnBlur
  });

  // console.log(form);
  const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } = form;
  const { errors, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } = formState

  console.log("FormState", isSubmitting, isSubmitted, isSubmitSuccessful, submitCount)
  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value)
    });

    return () => subscription.unsubscribe();
  }, [watch])
  console.log("errors", errors)
  const onSubmit = (data: FormValues) => {
    console.log("form submmitted", data);
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset])

  const handleGetvalues = () => {
    console.log("Get values", getValues());
    console.log("Get values of Phone Number", getValues("phoneNumbers"));
    console.log("Get values of age and email ", getValues(["age", "email"]))
  }

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("on OnError Function", errors)
  }

  const handleSetvalue = () => {
    setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  }
  renderCount++
  // const { name, ref, onChange, onBlur } = register("username");
  const { fields, append, remove } = useFieldArray({
    name: 'phNumbers',
    control
  });

  // const watchUsername = watch(["username", "channel", "email"]);
  return (
    <div>
      <h1>YouTube Form  {renderCount / 2}</h1>
      {/* <h2>Watched value: {watchUsername}</h2> */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" {...register("username", {
            required: {
              value: true,
              message: "username is mandotory"
            }
          })} />
          <p className="error">{errors.username?.message}</p>

        </div>
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" {...register("email", {
            pattern: {
              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              message: "please enter valid email"
            },
            validate: {
              notAdmin: (fieldValue) => {
                return fieldValue !== "admin@gmail.com" || 'Enter diffrent email address'
              },
              notBlockListed: (fieldValue) => {
                return !fieldValue.endsWith("gl.com") || "This domain not supported"
              },
              // emailAvailable: async (fieldValue) => {
              //   const response = await fetch(`https://jsonplaceholder.typicode.com/users?=${fieldValue}`);
              //   const data = await response.json();
              //   return data.length == 0 || "Email Already Exists"
              // }
            }
          })} />
          <p className="error">{errors.email?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input type="text" id="channel" {...register("channel", {
            required: {
              value: true,
              message: "channel is mandotory"
            }
          })} />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input type="text" id="twitter" {...register("social.twitter", {
            disabled: watch("channel") === "",
            required: "Enter Twitter Profile"
          })} />
        </div>

        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input type="text" id="facebook" {...register("social.facebook")} />
        </div>
        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone Number</label>
          <input type="text" id="primary-phone" {...register("phoneNumbers.0")} />
        </div>
        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary Phone Number</label>
          <input type="text" id="secondary-phone" {...register("phoneNumbers.1")} />
        </div>

        <div>
          <label>List of Phone numbers</label>
          <div>
            {
              fields.map((field, index) => {
                return (<div className="form-control" key={field.id}>
                  <input type="text" {...register(`phNumbers.${index}.number` as const)} />
                  {
                    index > 0 && (
                      <button type="button" onClick={() => remove(index)}> Remove</button>
                    )
                  }
                </div>)
              })
            }
            <button type="button" onClick={() => append({ number: "" })}> Add phone number</button>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input type="number" id="age" {...register("age", {
            valueAsNumber: true,
            required: {
              value: true,
              message: "age is mandotory"
            }
          })} />
          <p className="error">{errors.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">DOB</label>
          <input type="date" id="dob" {...register("dob", {
            valueAsDate: true,
            required: {
              value: true,
              message: "dob is mandotory"
            }
          })} />
          <p className="error">{errors.dob?.message}</p>
        </div>
        <button disabled={!isDirty || isSubmitting}>Submit</button>
        <button type="button" onClick={handleGetvalues}>Get Values</button>
        <button type="button" onClick={handleSetvalue}>Set Values</button>
        <button type="button" onClick={() => reset()}>Reset</button>
        <button type="button" onClick={() => trigger()}>Validate</button>
        {/* <button type="button" onClick={() => trigger("channel")}>Validate channel</button> */}
      </form>
      <DevTool control={control} />
    </div>
  )
}
