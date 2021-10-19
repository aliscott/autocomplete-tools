const _gen: Record<string, Fig.Generator> = {
  npm: {
    script(context) {
      if (context[context.length - 1] === "") return "";
      const searchTerm = context[context.length - 1];
      return `curl -s -H "Accept: application/json" "https://api.npms.io/v2/search?q=${searchTerm}&size=20"`;
    },
    postProcess(script: string) {
      try {
        const { results } = JSON.parse(script);
        return results.map((item) => ({
          name: item.package.name,
          description: item.package.description,
        })) as Fig.Suggestion[];
      } catch (e) {
        return [];
      }
    },
  },
  "xcode-configuration": {
    script: "xcodebuild -project ios/*.xcodeproj -list -json",
    postProcess: (script: string) =>
      JSON.parse(script).project.configurations.map((name) => ({ name })),
  },
  "xcode-scheme": {
    script: "xcodebuild -project ios/*.xcodeproj -list -json",
    postProcess: (script: string) => JSON.parse(script).project.schemes.map((name) => ({ name })),
  },
  "xcode-devices": {
    script: "xcrun xctrace list devices",
    postProcess: (script: string) =>
      script
        .split("\n")
        .filter((item) => !item.match(/^=/))
        .filter(Boolean)
        .map((item) => item.split(/(.*?) (\(([0-9.]+)\) )?\(([0-9A-F-]+)\)/i))
        // filter catalyst
        .filter((item: string[] | null) => !!item?.[3])
        .map(([, name, , osVersion, udid]) => ({
          displayName: `${name.trim()} (${osVersion})`,
          name: udid,
        })),
  },
  "max-workers": {
    script: "sysctl -n hw.ncpu",
    postProcess: (script: string) => {
      const count = Number(script);
      return Array.from({ length: count }, (_, i) => {
        const v = count - i;
        return {
          priority: v,
          name: String(v),
        };
      });
    },
  },
};

const completionSpec: Fig.Spec = {
  name: "expo-cli",
  icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/expo.png",
  description: "Tools for creating, running, and deploying Universal Expo and React Native apps",
  options: [
    {
      name: ["-h", "--help"],
      priority: 1,
      description: "Output usage information",
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
    },
    {
      name: ["-V", "--version"],
      description: "Output the version number",
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/info.png",
      priority: 1,
    },
  ],
  subcommands: [
    {
      name: ["build:ios", "bi"],
      hidden: false,
      description: "Build and sign a standalone IPA for the Apple App Store",
      priority: 59,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-c", "--clear-credentials"],
          description: "Clear all credentials stored on Expo servers",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/clear.png",
        },
        {
          name: "--clear-dist-cert",
          description: "Remove Distribution Certificate stored on Expo servers",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/clear.png",
        },
        {
          name: "--clear-push-key",
          description: "Remove Push Notifications Key stored on Expo servers",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/clear.png",
        },
        {
          name: "--clear-push-cert",
          description:
            "Remove Push Notifications Certificate stored on Expo servers. Use of Push Notifications Certificates is deprecated",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/clear.png",
        },
        {
          name: "--clear-provisioning-profile",
          description: "Remove Provisioning Profile stored on Expo servers",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/clear.png",
        },
        {
          name: ["-r", "--revoke-credentials"],
          description:
            "Revoke credentials on developer.apple.com, select appropriate using --clear-* options",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/clear.png",
        },
        {
          name: "--apple-id",
          description:
            "Apple ID username (please also set the Apple ID password as EXPO_APPLE_PASSWORD environment variable)",
          args: {
            name: "login",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
        },
        {
          name: ["-t", "--type"],
          description: "Type of build: [archive|simulator]",
          args: {
            name: "archive|simulator",
            isOptional: false,
            suggestions: [
              {
                name: "archive",
              },
              {
                name: "simulator",
                icon:
                  "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/devices.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--release-channel",
          description: "Pull from specified release channel",
          args: {
            name: "name",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--no-publish",
          description: "Disable automatic publishing before building",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--no-wait",
          description: "Exit immediately after scheduling build",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--team-id",
          description: "Apple Team ID",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--dist-p12-path",
          description:
            "Path to your Distribution Certificate P12 (set password as EXPO_IOS_DIST_P12_PASSWORD environment variable)",
          args: {
            name: "path",
            isOptional: false,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/path.png",
        },
        {
          name: "--push-id",
          description: "Push Key ID (ex: 123AB4C56D)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--push-p8-path",
          description: "Path to your Push Key .p8 file",
          args: {
            name: "path",
            isOptional: false,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/path.png",
        },
        {
          name: "--provisioning-profile-path",
          description: "Path to your Provisioning Profile",
          args: {
            name: "path",
            isOptional: false,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/path.png",
        },
        {
          name: "--public-url",
          description: "The URL of an externally hosted manifest (for self-hosted apps)",
          args: {
            name: "url",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--skip-credentials-check",
          description: "Skip checking credentials",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--skip-workflow-check",
          description: "Skip warning about build service bare workflow limitations",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
    },
    {
      name: ["build:android", "ba"],
      hidden: false,
      description: "Build and sign a standalone APK or App Bundle for the Google Play Store",
      priority: 59,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-c", "--clear-credentials"],
          description: "Clear stored credentials",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/clear.png",
        },
        {
          name: "--release-channel",
          description: "Pull from specified release channel",
          args: {
            name: "name",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--no-publish",
          description: "Disable automatic publishing before building",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--no-wait",
          description: "Exit immediately after triggering build",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--keystore-path",
          description: "Path to your Keystore: *.jks",
          args: {
            name: "path",
            isOptional: false,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/key.png",
        },
        {
          name: "--keystore-alias",
          description: "Keystore Alias",
          args: {
            name: "alias",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/key.png",
        },
        {
          name: "--generate-keystore",
          description: "[deprecated] Generate Keystore if one does not exist",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/key.png",
        },
        {
          name: "--public-url",
          description: "The URL of an externally hosted manifest (for self-hosted apps)",
          args: {
            name: "url",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--skip-workflow-check",
          description: "Skip warning about build service bare workflow limitations",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: ["-t", "--type"],
          description: "Type of build: [app-bundle|apk]",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
    },
    {
      name: "build:web",
      hidden: false,
      description: "Build the web app for production",
      priority: 59,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-c", "--clear"],
          description: "Clear all cached build files and assets",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/clear.png",
        },
        {
          name: "--no-pwa",
          description:
            "Prevent webpack from generating the manifest.json and injecting meta into the index.html head",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: ["-d", "--dev"],
          description: "Turns dev flag on before bundling",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/dev.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/webpack.png",
    },
    {
      name: ["build:status", "bs"],
      hidden: false,
      description: "Get the status of the latest build for the project",
      priority: 59,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--public-url",
          description: "The URL of an externally hosted manifest (for self-hosted apps)",
          args: {
            name: "url",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/info.png",
    },
    {
      name: "bundle-assets",
      hidden: true,
      description:
        "Bundle assets for a detached app. This command should be executed from xcode or gradle",
      priority: 51,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--dest",
          description: "Destination directory for assets",
          args: {
            name: "dest",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--platform",
          description: "Detached project platform",
          args: {
            name: "platform",
            isOptional: false,
            suggestions: [
              {
                name: "android",
                icon:
                  "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
              },
              {
                name: "ios",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/devices.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
    },
    {
      name: "client:ios",
      hidden: false,
      description:
        "Experimental: build a custom version of Expo Go for iOS using your own Apple credentials",
      priority: 52,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--apple-id",
          description:
            "Apple ID username (please also set the Apple ID password as EXPO_APPLE_PASSWORD environment variable)",
          args: {
            name: "login",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/download.png",
    },
    {
      name: "client:install:ios",
      hidden: false,
      description: "Install Expo Go for iOS on the simulator",
      priority: 62,
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--latest",
          description:
            "Install the latest version of Expo Go, ignoring the current project version",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/latest.png",
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
    },
    {
      name: "client:install:android",
      hidden: false,
      description: "Install Expo Go for Android on a connected device or emulator",
      priority: 62,
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--latest",
          description: "Install the latest version of Expo Go, ignore the current project version",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/latest.png",
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
    },
    {
      name: "config",
      hidden: false,
      description: "Show the project config",
      priority: 61,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-t", "--type"],
          description: "Type of config to show",
          args: {
            name: "public|prebuild|introspect",
            isOptional: false,
            suggestions: [
              {
                name: "public",
              },
              {
                name: "prebuild",
              },
              {
                name: "introspect",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--full",
          description: "Include all project config data",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/config.png",
    },
    {
      name: "credentials:manager",
      hidden: false,
      description: "Manage your credentials",
      priority: 58,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-p", "--platform"],
          description: "Platform: [android|ios]",
          args: {
            name: "platform",
            isOptional: false,
            suggestions: [
              {
                name: "android",
                icon:
                  "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
              },
              {
                name: "ios",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/devices.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/list.png",
    },
    {
      name: "customize:web",
      hidden: false,
      description: "Eject the default web files for customization",
      priority: 53,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-f", "--force"],
          description: "Allows replacing existing files",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/force.png",
        },
        {
          name: "--offline",
          description: "Allows this command to run while offline",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/offline.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/customize.png",
    },
    {
      name: "diagnostics",
      hidden: false,
      description: "Log environment info to the console",
      priority: 61,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/diagnostics.png",
    },
    {
      name: "doctor",
      hidden: false,
      description: "Diagnose issues with the project",
      priority: 61,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/doctor.png",
    },
    {
      name: "eject",
      hidden: false,
      description:
        "Create native iOS and Android project files. Learn more: https://docs.expo.io/workflow/customizing/",
      priority: 53,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--no-install",
          description: "Skip installing npm packages and CocoaPods",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--npm",
          description: "Use npm to install dependencies. (default when Yarn is not installed)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "fig://icon?type=npm",
        },
        {
          name: ["-p", "--platform"],
          description: "Platforms to sync: ios, android, all. Default: all",
          args: {
            name: "platform",
            isOptional: false,
            suggestions: [
              {
                name: "all",
              },
              {
                name: "android",
                icon:
                  "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
              },
              {
                name: "ios",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/devices.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/eject.png",
    },
    {
      name: "export",
      hidden: false,
      description: "Export the static files of the app for hosting it on a web server",
      priority: 64,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-p", "--public-url"],
          description: "The public url that will host the static files. (Required)",
          args: {
            name: "url",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: ["-c", "--clear"],
          description: "Clear the Metro bundler cache",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/clear.png",
        },
        {
          name: "--output-dir",
          description: "The directory to export the static files to. Default directory is `dist`",
          args: {
            name: "dir",
            isOptional: false,
            template: "folders",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/path.png",
        },
        {
          name: ["-a", "--asset-url"],
          description:
            "The absolute or relative url that will host the asset files. Default is './assets', which will be resolved against the public-url",
          args: {
            name: "url",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: ["-d", "--dump-assetmap"],
          description: "Dump the asset map for further processing",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/export.png",
        },
        {
          name: "--dev",
          description: "Configure static files for developing locally using a non-https server",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/dev.png",
        },
        {
          name: ["-s", "--dump-sourcemap"],
          description: "Dump the source map for debugging the JS bundle",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/export.png",
        },
        {
          name: ["-q", "--quiet"],
          description: "Suppress verbose output",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/quiet.png",
        },
        {
          name: ["-t", "--target"],
          description: "Target environment for which this export is intended",
          args: {
            name: "managed|bare",
            isOptional: false,
            suggestions: [
              {
                name: "managed",
              },
              {
                name: "bare",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
        {
          name: "--merge-src-dir",
          description: "A repeatable source dir to merge in",
          args: {
            name: "dir",
            isOptional: false,
            template: "folders",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/path.png",
        },
        {
          name: "--merge-src-url",
          description: "A repeatable source tar.gz file URL to merge in",
          args: {
            name: "url",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--max-workers",
          description: "Maximum number of tasks to allow Metro to spawn",
          args: {
            generators: _gen[`max-workers`],
            name: "Number of workers",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/number.png",
        },
        {
          name: "--experimental-bundle",
          description: "Export bundles for use with EAS updates",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/export.png",
    },
    {
      name: "fetch:ios:certs",
      hidden: false,
      description: "Download the project's iOS standalone app signing credentials",
      priority: 58,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
    },
    {
      name: "fetch:android:keystore",
      hidden: false,
      description: "Download the project's Android keystore",
      priority: 58,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
    },
    {
      name: "fetch:android:hashes",
      hidden: false,
      description: "Compute and log the project's Android key hashes",
      priority: 58,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
    },
    {
      name: "fetch:android:upload-cert",
      hidden: false,
      description: "Download the project's Android keystore",
      priority: 58,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
    },
    {
      name: ["init", "i"],
      hidden: false,
      description: "Create a new Expo project",
      priority: 64,
      args: {
        isOptional: true,
        name: "name",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-t", "--template"],
          description:
            'Specify which template to use. Valid options are "blank", "tabs", "bare-minimum" or a package on npm (e.g. "expo-template-bare-minimum") that includes an Expo project template',
          args: {
            name: "name",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/export.png",
        },
        {
          name: "--npm",
          description: "Use npm to install dependencies. (default when Yarn is not installed)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "fig://icon?type=npm",
        },
        {
          name: "--yarn",
          description: "Use Yarn to install dependencies. (default when Yarn is installed)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "fig://icon?type=yarn",
        },
        {
          name: "--no-install",
          description: "Skip installing npm packages or CocoaPods",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--name",
          description: "The name of your app visible on the home screen",
          args: {
            name: "name",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--yes",
          description: 'Use default options. Same as "expo init . --template blank',
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/init.png",
    },
    {
      name: ["install", "add"],
      hidden: false,
      description: "Install a unimodule or other package to a project",
      priority: 64,
      args: {
        generators: _gen.npm,
        isOptional: true,
        name: "packages",
        isVariadic: true,
        debounce: true,
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--npm",
          description: "Use npm to install dependencies. (default when package-lock.json exists)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "fig://icon?type=npm",
        },
        {
          name: "--yarn",
          description: "Use Yarn to install dependencies. (default when yarn.lock exists)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "fig://icon?type=yarn",
        },
      ],
      icon: "fig://icon?type=npm",
    },
    {
      name: ["login", "signin"],
      hidden: false,
      description: "Login to an Expo account",
      priority: 63,
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-u", "--username"],
          description: "Username",
          args: {
            name: "string",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: ["-p", "--password"],
          description: "Password",
          args: {
            name: "string",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--otp",
          description: "One-time password from your 2FA device",
          args: {
            name: "string",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/login.png",
    },
    {
      name: "logout",
      hidden: false,
      description: "Logout of an Expo account",
      priority: 63,
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/logout.png",
    },
    {
      name: "prebuild",
      hidden: false,
      description:
        "Experimental: Create native iOS and Android project files before building natively. Learn more: https://docs.expo.io/workflow/customizing/",
      priority: 53,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--no-install",
          description: "Skip installing npm packages and CocoaPods",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--clean",
          description: "Delete the native folders and regenerate them before applying changes",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/clear.png",
        },
        {
          name: "--npm",
          description: "Use npm to install dependencies. (default when Yarn is not installed)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "fig://icon?type=npm",
        },
        {
          name: "--template",
          description:
            "Project template to clone from. File path pointing to a local tar file or a github repo",
          args: {
            name: "template",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/export.png",
        },
        {
          name: ["-p", "--platform"],
          description: "Platforms to sync: ios, android, all. Default: all",
          args: {
            name: "platform",
            isOptional: false,
            suggestions: [
              {
                name: "all",
              },
              {
                name: "android",
                icon:
                  "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
              },
              {
                name: "ios",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/devices.png",
        },
        {
          name: "--skip-dependency-update",
          description:
            "Preserves versions of listed packages in package.json (comma separated list)",
          args: {
            name: "dependencies",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/prebuild.png",
    },
    {
      name: "prepare-detached-build",
      hidden: true,
      description: "Prepare a detached project for building",
      priority: 51,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--platform",
          description: "Detached project platform",
          args: {
            name: "platform",
            isOptional: false,
            suggestions: [
              {
                name: "android",
                icon:
                  "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
              },
              {
                name: "ios",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/devices.png",
        },
        {
          name: "--skipXcodeConfig",
          description: "[iOS only] if true, do not configure Xcode project",
          args: {
            name: "bool",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
    },
    {
      name: ["publish", "p"],
      hidden: false,
      description: "Deploy a project to Expo hosting",
      priority: 64,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-q", "--quiet"],
          description: "Suppress verbose output from the Metro bundler",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/quiet.png",
        },
        {
          name: ["-s", "--send-to"],
          description: "A phone number or email address to send a link to",
          args: {
            name: "dest",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/send.png",
        },
        {
          name: ["-c", "--clear"],
          description: "Clear the Metro bundler cache",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/clear.png",
        },
        {
          name: ["-t", "--target"],
          description:
            "Target environment for which this publish is intended. Options are `managed` or `bare`",
          args: {
            name: "managed|bare",
            isOptional: false,
            suggestions: [
              {
                name: "managed",
              },
              {
                name: "bare",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
        {
          name: "--max-workers",
          description: "Maximum number of tasks to allow Metro to spawn",
          args: {
            generators: _gen[`max-workers`],
            name: "Number of workers",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/number.png",
        },
        {
          name: "--release-channel",
          description: "The release channel to publish to. Default is 'default'",
          args: {
            name: "name",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/publish.png",
    },
    {
      name: ["publish:set", "ps"],
      hidden: false,
      description: "Specify the channel to serve a published release",
      priority: 60,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-c", "--release-channel"],
          description: "The channel to set the published release. (Required)",
          args: {
            name: "name",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: ["-p", "--publish-id"],
          description: "The id of the published release to serve from the channel. (Required)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/publish.png",
    },
    {
      name: ["publish:rollback", "pr"],
      hidden: false,
      description: "Undo an update to a channel",
      priority: 60,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--channel-id",
          description: "This flag is deprecated",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: ["-c", "--release-channel"],
          description: "The channel to rollback from. (Required)",
          args: {
            name: "name",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: ["-s", "--sdk-version"],
          description: "The sdk version to rollback. (Required)",
          args: {
            name: "version",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/expo.png",
        },
        {
          name: ["-p", "--platform"],
          description: "The platform to rollback",
          args: {
            name: "platform",
            isOptional: false,
            suggestions: [
              {
                name: "android",
                icon:
                  "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
              },
              {
                name: "ios",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/devices.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon:
        "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/publish-rollback.png",
    },
    {
      name: ["publish:history", "ph"],
      hidden: false,
      description: "Log the project's releases",
      priority: 60,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-c", "--release-channel"],
          description:
            "Filter by release channel. If this flag is not included, the most recent publications will be shown",
          args: {
            name: "name",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--count",
          description: "Number of logs to view, maximum 100, default 5",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/number.png",
        },
        {
          name: ["-p", "--platform"],
          description: "Filter by platform, android or ios. Defaults to both platforms",
          args: {
            name: "platform",
            isOptional: false,
            suggestions: [
              {
                name: "android",
                icon:
                  "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
              },
              {
                name: "ios",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/devices.png",
        },
        {
          name: ["-s", "--sdk-version"],
          description: "Filter by SDK version e.g. 35.0.0",
          args: {
            name: "version",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/expo.png",
        },
        {
          name: ["-r", "--raw"],
          description: "Produce some raw output",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/publish.png",
    },
    {
      name: ["publish:details", "pd"],
      hidden: false,
      description: "Log details of a published release",
      priority: 60,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--publish-id",
          description: "Publication id. (Required)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: ["-r", "--raw"],
          description: "Produce some raw output",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/publish.png",
    },
    {
      name: "push:android:upload",
      hidden: false,
      description: "Upload an FCM key for Android push notifications",
      priority: 57,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--api-key",
          description: "Server API key for FCM",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/key.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/push.png",
    },
    {
      name: "push:android:show",
      hidden: false,
      description: "Log the value currently in use for FCM notifications for this project",
      priority: 57,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/push.png",
    },
    {
      name: "push:android:clear",
      hidden: false,
      description: "Delete a previously uploaded FCM credential",
      priority: 57,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/push-clear.png",
    },
    {
      name: "register",
      hidden: false,
      description: "Sign up for a new Expo account",
      priority: 63,
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/register.png",
    },
    {
      name: "run:android",
      hidden: false,
      description: "Run the Android app binary locally",
      priority: 64,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--no-bundler",
          description: "Skip starting the Metro bundler",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/metro.png",
        },
        {
          name: ["-d", "--device"],
          description: "Device name to build the app on",
          args: {
            name: "device",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/devices.png",
        },
        {
          name: ["-p", "--port"],
          description: "Port to start the Metro bundler on. Default: 8081",
          args: {
            name: "port",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/number.png",
        },
        {
          name: "--variant",
          description: "(Android) build variant",
          args: {
            name: "name",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
    },
    {
      name: "run:ios",
      hidden: false,
      description: "Run the iOS app binary locally",
      priority: 64,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--no-bundler",
          description: "Skip starting the Metro bundler",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/metro.png",
        },
        {
          name: ["-d", "--device"],
          description: "Device name or UDID to build the app on",
          args: {
            generators: _gen[`xcode-devices`],
            name: "device",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/devices.png",
        },
        {
          name: ["-p", "--port"],
          description: "Port to start the Metro bundler on. Default: 8081",
          args: {
            name: "port",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/number.png",
        },
        {
          name: "--scheme",
          description: "Scheme to build",
          args: {
            generators: _gen[`xcode-scheme`],
            name: "scheme",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--configuration",
          description: "Xcode configuration to use. Debug or Release. Default: Debug",
          args: {
            generators: _gen[`xcode-configuration`],
            name: "configuration",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
    },
    {
      name: "send",
      hidden: false,
      description: "Share the project's URL to an email address",
      priority: 64,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-s", "--send-to"],
          description: "Email address to send the URL to",
          args: {
            name: "dest",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/send.png",
        },
        {
          name: "--dev-client",
          description: "Experimental: Starts the bundler for use with the expo-development-client",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/dev.png",
        },
        {
          name: "--scheme",
          description: "Custom URI protocol to use with a dev client",
          args: {
            name: "scheme",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/scheme.png",
        },
        {
          name: ["-a", "--android"],
          description: "Opens your app in Expo Go on a connected Android device",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
        },
        {
          name: ["-i", "--ios"],
          description:
            "Opens your app in Expo Go in a currently running iOS simulator on your computer",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
        },
        {
          name: ["-w", "--web"],
          description: "Opens your app in a web browser",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/web.png",
        },
        {
          name: ["-m", "--host"],
          description:
            'Lan (default), tunnel, localhost. Type of host to use. "tunnel" allows you to view your link on other networks',
          args: {
            name: "mode",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/lan.png",
        },
        {
          name: "--tunnel",
          description: "Same as --host tunnel",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/tunnel.png",
        },
        {
          name: "--lan",
          description: "Same as --host lan",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/lan.png",
        },
        {
          name: "--localhost",
          description: "Same as --host localhost",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/localhost.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/send.png",
    },
    {
      name: ["start", "r"],
      hidden: false,
      description: "Start a local dev server for the app",
      priority: 64,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: ["-s", "--send-to"],
          description: "An email address to send a link to",
          args: {
            name: "dest",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/send.png",
        },
        {
          name: ["-c", "--clear"],
          description: "Clear the Metro bundler cache",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/clear.png",
        },
        {
          name: "--max-workers",
          description: "Maximum number of tasks to allow Metro to spawn",
          args: {
            generators: _gen[`max-workers`],
            name: "Number of workers",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/number.png",
        },
        {
          name: "--dev",
          description: "Turn development mode on",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/dev.png",
        },
        {
          name: "--no-dev",
          description: "Turn development mode off",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--minify",
          description: "Minify code",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/minify.png",
        },
        {
          name: "--no-minify",
          description: "Do not minify code",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--https",
          description: "To start webpack with https protocol",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/lock.png",
        },
        {
          name: ["-p", "--port"],
          description:
            "Port to start the native Metro bundler on (does not apply to web or tunnel). Default: 19000",
          args: {
            name: "port",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/number.png",
        },
        {
          name: "--no-https",
          description: "To start webpack with http protocol",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--dev-client",
          description: "Experimental: Starts the bundler for use with the expo-development-client",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/dev.png",
        },
        {
          name: "--scheme",
          description: "Custom URI protocol to use with a dev client",
          args: {
            name: "scheme",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/scheme.png",
        },
        {
          name: ["-a", "--android"],
          description: "Opens your app in Expo Go on a connected Android device",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
        },
        {
          name: ["-i", "--ios"],
          description:
            "Opens your app in Expo Go in a currently running iOS simulator on your computer",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
        },
        {
          name: ["-w", "--web"],
          description: "Opens your app in a web browser",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/web.png",
        },
        {
          name: ["-m", "--host"],
          description:
            'Lan (default), tunnel, localhost. Type of host to use. "tunnel" allows you to view your link on other networks',
          args: {
            name: "mode",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/lan.png",
        },
        {
          name: "--tunnel",
          description: "Same as --host tunnel",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/tunnel.png",
        },
        {
          name: "--lan",
          description: "Same as --host lan",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/lan.png",
        },
        {
          name: "--localhost",
          description: "Same as --host localhost",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/localhost.png",
        },
        {
          name: "--offline",
          description: "Allows this command to run while offline",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/offline.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/play.png",
    },
    {
      name: ["start:web", "web"],
      hidden: false,
      description: "Start a Webpack dev server for the web app",
      priority: 64,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--dev",
          description: "Turn development mode on",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/dev.png",
        },
        {
          name: "--no-dev",
          description: "Turn development mode off",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--minify",
          description: "Minify code",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/minify.png",
        },
        {
          name: "--no-minify",
          description: "Do not minify code",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: "--https",
          description: "To start webpack with https protocol",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/lock.png",
        },
        {
          name: "--no-https",
          description: "To start webpack with http protocol",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/skip.png",
        },
        {
          name: ["-p", "--port"],
          description: "Port to start the Webpack bundler on. Default: 19006",
          args: {
            name: "port",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/number.png",
        },
        {
          name: ["-s", "--send-to"],
          description: "An email address to send a link to",
          args: {
            name: "dest",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/send.png",
        },
        {
          name: "--dev-client",
          description: "Experimental: Starts the bundler for use with the expo-development-client",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/dev.png",
        },
        {
          name: "--scheme",
          description: "Custom URI protocol to use with a dev client",
          args: {
            name: "scheme",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/scheme.png",
        },
        {
          name: ["-a", "--android"],
          description: "Opens your app in Expo Go on a connected Android device",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
        },
        {
          name: ["-i", "--ios"],
          description:
            "Opens your app in Expo Go in a currently running iOS simulator on your computer",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
        },
        {
          name: ["-w", "--web"],
          description: "Opens your app in a web browser",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/web.png",
        },
        {
          name: ["-m", "--host"],
          description:
            'Lan (default), tunnel, localhost. Type of host to use. "tunnel" allows you to view your link on other networks',
          args: {
            name: "mode",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/lan.png",
        },
        {
          name: "--tunnel",
          description: "Same as --host tunnel",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/tunnel.png",
        },
        {
          name: "--lan",
          description: "Same as --host lan",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/lan.png",
        },
        {
          name: "--localhost",
          description: "Same as --host localhost",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/localhost.png",
        },
        {
          name: "--offline",
          description: "Allows this command to run while offline",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/offline.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/web.png",
    },
    {
      name: ["upgrade", "update"],
      hidden: false,
      description: "Upgrade the project packages and config for the given SDK version",
      priority: 61,
      args: {
        isOptional: true,
        name: "sdk-version",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--npm",
          description: "Use npm to install dependencies. (default when package-lock.json exists)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "fig://icon?type=npm",
        },
        {
          name: "--yarn",
          description: "Use Yarn to install dependencies. (default when yarn.lock exists)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "fig://icon?type=yarn",
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/upgrade.png",
    },
    {
      name: ["upload:android", "ua"],
      hidden: false,
      description: "Upload an Android binary to the Google Play Store",
      priority: 54,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--latest",
          description: "Upload the latest build",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/latest.png",
        },
        {
          name: "--id",
          description: "Id of the build to upload",
          args: {
            name: "id",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--path",
          description: "Path to the .apk/.aab file",
          args: {
            name: "path",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/path.png",
        },
        {
          name: "--url",
          description: "App archive url",
          args: {
            name: "url",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--key",
          description: "Path to the JSON key used to authenticate with Google Play",
          args: {
            name: "key",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/key.png",
        },
        {
          name: "--android-package",
          description: "Android package name (using expo.android.package from app.json by default)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
        },
        {
          name: "--type",
          description: "Archive type: apk, aab",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--track",
          description:
            "The track of the application to use, choose from: production, beta, alpha, internal, rollout",
          args: {
            name: "track",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--release-status",
          description:
            "Release status (used when uploading new apks/aabs), choose from: completed, draft, halted, inProgress",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--use-submission-service",
          description:
            "Experimental: Use Submission Service for uploading your app. The upload process will happen on Expo servers",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--verbose",
          description: "Always print logs from Submission Service",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/verbose.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/play-store.png",
    },
    {
      name: ["upload:ios", "ui"],
      hidden: false,
      description: "Unsupported: Use eas submit or Transporter app instead",
      priority: 54,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--latest",
          description: "Upload the latest build (default)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/latest.png",
        },
        {
          name: "--id",
          description: "Id of the build to upload",
          args: {
            name: "id",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--path",
          description: "Path to the .ipa file",
          args: {
            name: "path",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/path.png",
        },
        {
          name: "--url",
          description: "App archive url",
          args: {
            name: "url",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--apple-id",
          description: "Your Apple ID username (you can also set EXPO_APPLE_ID env variable)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
        },
        {
          name: "--itc-team-id",
          description:
            "App Store Connect Team ID - this option is deprecated, the proper ID is resolved automatically",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--apple-id-password",
          description: "Your Apple ID password (you can also set EXPO_APPLE_PASSWORD env variable)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
        },
        {
          name: "--app-name",
          description:
            "The name of your app as it will appear on the App Store, this can't be longer than 30 characters (default: expo.name from app.json)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--company-name",
          description:
            "The name of your company, needed only for the first upload of any app to App Store",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--sku",
          description:
            "A unique ID for your app that is not visible on the App Store, will be generated unless provided",
          args: {
            name: "sku",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--language",
          description:
            "Primary language (e.g. English, German; run `expo upload:ios --help` to see the list of available languages)",
          args: {
            name: "language",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--public-url",
          description: "The URL of an externally hosted manifest (for self-hosted apps)",
          args: {
            name: "url",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/app-store.png",
    },
    {
      name: ["url", "u"],
      hidden: false,
      description: "Log a URL for opening the project in Expo Go",
      priority: 56,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--dev-client",
          description: "Experimental: Starts the bundler for use with the expo-development-client",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/dev.png",
        },
        {
          name: "--scheme",
          description: "Custom URI protocol to use with a dev client",
          args: {
            name: "scheme",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/scheme.png",
        },
        {
          name: ["-a", "--android"],
          description: "Opens your app in Expo Go on a connected Android device",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/android.png",
        },
        {
          name: ["-i", "--ios"],
          description:
            "Opens your app in Expo Go in a currently running iOS simulator on your computer",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/apple.png",
        },
        {
          name: ["-w", "--web"],
          description: "Opens your app in a web browser",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/web.png",
        },
        {
          name: ["-m", "--host"],
          description:
            'Lan (default), tunnel, localhost. Type of host to use. "tunnel" allows you to view your link on other networks',
          args: {
            name: "mode",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/lan.png",
        },
        {
          name: "--tunnel",
          description: "Same as --host tunnel",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/tunnel.png",
        },
        {
          name: "--lan",
          description: "Same as --host lan",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/lan.png",
        },
        {
          name: "--localhost",
          description: "Same as --host localhost",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/localhost.png",
        },
        {
          name: "--offline",
          description: "Allows this command to run while offline",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/offline.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/url.png",
    },
    {
      name: "url:ipa",
      hidden: false,
      description: "Log the download URL for the standalone iOS binary",
      priority: 56,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--public-url",
          description: "The URL of an externally hosted manifest (for self-hosted apps)",
          args: {
            name: "url",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/app-store.png",
    },
    {
      name: "url:apk",
      hidden: false,
      description: "Log the download URL for the standalone Android binary",
      priority: 56,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--public-url",
          description: "The URL of an externally hosted manifest (for self-hosted apps)",
          args: {
            name: "url",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/play-store.png",
    },
    {
      name: "webhooks",
      hidden: false,
      description: "List all webhooks for a project",
      priority: 55,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/webhook.png",
    },
    {
      name: "webhooks:add",
      hidden: false,
      description: "Add a webhook to a project",
      priority: 55,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--url",
          description: "URL to request. (Required)",
          args: {
            name: "url",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--event",
          description: "Event type that triggers the webhook. [build] (Required)",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--secret",
          description:
            "Secret used to create a hash signature of the request payload, provided in the 'Expo-Signature' header",
          args: {
            name: "secret",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/lock.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/webhook-add.png",
    },
    {
      name: "webhooks:remove",
      hidden: false,
      description: "Delete a webhook",
      priority: 55,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--id",
          description: "ID of the webhook to remove",
          args: {
            name: "id",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/webhook-remove.png",
    },
    {
      name: "webhooks:update",
      hidden: false,
      description: "Update an existing webhook",
      priority: 55,
      args: {
        isOptional: true,
        template: "folders",
        name: "path",
      },
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
        {
          name: "--id",
          description: "ID of the webhook to update",
          args: {
            name: "id",
            isOptional: false,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--url",
          description: "URL the webhook will request",
          args: {
            name: "url",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--event",
          description: "Event type that triggers the webhook. [build]",
          args: {
            name: "boolean",
            suggestions: [
              {
                name: "true",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/true.png",
              },
              {
                name: "false",
                icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/false.png",
              },
            ],
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/string.png",
        },
        {
          name: "--secret",
          description:
            "Secret used to create a hash signature of the request payload, provided in the 'Expo-Signature' header",
          args: {
            name: "secret",
            isOptional: true,
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/lock.png",
        },
        {
          name: "--config",
          description: "Deprecated: Use app.config.js to switch config files instead",
          args: {
            name: "file",
            isOptional: true,
            template: "filepaths",
          },
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/block.png",
          priority: 2,
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/webhook-update.png",
    },
    {
      name: ["whoami", "w"],
      hidden: false,
      description: "Return the currently authenticated account",
      priority: 63,
      options: [
        {
          name: ["-h", "--help"],
          priority: 1,
          description: "Output usage information",
          icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/help.png",
        },
      ],
      icon: "https://raw.githubusercontent.com/expo/expo-cli/master/assets/fig/info.png",
    },
  ],
};

export default completionSpec;
