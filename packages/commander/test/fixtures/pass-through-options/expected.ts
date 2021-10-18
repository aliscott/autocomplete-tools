// Autogenerated by @withfig/commander

const completionSpec: Fig.Spec = {
  name: "",
  options: [
    { name: ["-d", "--dry-run"] },
    {
      name: ["-h", "--help"],
      description: "display help for command",
      priority: 49,
    },
  ],
  args: [
    { name: "utility" },
    { name: "args", isOptional: true, isVariadic: true },
  ],
};

export default completionSpec;