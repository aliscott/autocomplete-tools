// Autogenerated by @withfig/commander
const completionSpec: Fig.Spec = {
  name: "@withfig/autocomplete-tools",
  description: "Dev tools for fig's autocomplete",
  subcommands: [
    {
      name: "init",
      description:
        "initialize fig custom spec boilerplate in current directory",
      options: [
        {
          name: ["-h", "--help"],
          description: "display help for command",
          priority: 49,
        },
      ],
    },
    {
      name: "create-spec",
      description: "create spec with given name",
      options: [
        {
          name: ["-h", "--help"],
          description: "display help for command",
          priority: 49,
        },
      ],
      args: [{ name: "name", isOptional: true }],
    },
    {
      name: "compile",
      description: "compile specs in the current directory",
      options: [
        {
          name: ["-w", "--watch"],
          description: "Watch files and re-compile on change",
        },
        {
          name: ["-h", "--help"],
          description: "display help for command",
          priority: 49,
        },
      ],
    },
    {
      name: "dev",
      description: "watch for changes and compile specs",
      options: [
        {
          name: ["-h", "--help"],
          description: "display help for command",
          priority: 49,
        },
      ],
    },
    {
      name: "merge",
      description: "deep merge new spec into old spec",
      options: [
        {
          name: ["-n", "--new-file"],
          description: "Create a new spec file instead of updating the old one",
          args: { name: "path", template: "filepaths" },
        },
        {
          name: ["-i", "--ignore-props"],
          description: "The props that should always be overridden.",
          args: { name: "props" },
          exclusiveOn: ["--preset"],
        },
        {
          name: ["--ignore-command-props"],
          description: "The command props that should always be overridden.",
          args: { name: "props" },
          exclusiveOn: ["--preset"],
        },
        {
          name: ["--ignore-option-props"],
          description: "The option props that should always be overridden.",
          args: { name: "props" },
          exclusiveOn: ["--preset"],
        },
        {
          name: ["--ignore-arg-props"],
          description: "The arg props that should always be overridden.",
          args: { name: "props" },
          exclusiveOn: ["--preset"],
        },
        {
          name: ["-p", "--preset"],
          description: "Use a preset",
          args: {
            name: "name",
            suggestions: [
              "commander",
              "oclif",
              "cobra",
              "clap",
              "swift-argument-parser",
            ],
          },
          priority: 76,
          exclusiveOn: [
            "--ignore-props",
            "--ignore-command-props",
            "--ignore-option-props",
            "--ignore-arg-props",
          ],
        },
        {
          name: ["-h", "--help"],
          description: "display help for command",
          priority: 49,
        },
      ],
      args: [
        { name: "oldspec", template: "filepaths" },
        { name: "newspec", template: "filepaths" },
      ],
    },
    {
      name: "version",
      subcommands: [
        {
          name: "add-diff",
          description:
            "generate version diff from  new spec and add into old spec",
          options: [
            {
              name: ["-n", "--new-path"],
              description:
                "Create a new spec folder instead of overwriting the old one",
              args: { name: "path" },
            },
            {
              name: ["--use-minor-base"],
              description: "Create a new version file per minor version",
            },
            {
              name: ["-h", "--help"],
              description: "display help for command",
              priority: 49,
            },
          ],
          args: [
            { name: "specName" },
            { name: "newSpecFile" },
            { name: "diffVersion" },
          ],
        },
        {
          name: "init-spec",
          description: "generate versioned spec in folder specified by path",
          options: [
            {
              name: ["-h", "--help"],
              description: "display help for command",
              priority: 49,
            },
          ],
          args: [{ name: "path" }],
        },
        {
          name: "precompute-specs",
          description:
            "[Unimplemented] Precompute versioned specs before publishing the specs repo (unimplemented)",
          options: [
            {
              name: ["-h", "--help"],
              description: "display help for command",
              priority: 49,
            },
          ],
          args: [{ name: "files", isVariadic: true }],
        },
        {
          name: "help",
          description: "display help for command",
          priority: 49,
          args: { name: "command", isOptional: true },
        },
      ],
      options: [
        {
          name: ["-h", "--help"],
          description: "display help for command",
          priority: 49,
        },
      ],
    },
    {
      name: "help",
      description: "display help for command",
      priority: 49,
      args: { name: "command", isOptional: true },
    },
  ],
  options: [
    { name: ["-V", "--version"], description: "output the version number" },
    {
      name: ["-h", "--help"],
      description: "display help for command",
      priority: 49,
    },
  ],
  icon: "https://fig.io/icons/fig-light.png",
};
export default completionSpec;
