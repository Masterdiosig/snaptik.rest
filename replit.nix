{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.chromium
  ];

  env = {
    CHROME_PATH = "${pkgs.chromium}/bin/chromium";
  };
}
