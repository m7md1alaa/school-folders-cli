class schoolFolderCli < Formula
  desc "command-line tool designed to help students organize their academic files by automatically creating a structured folder system"
  homepage "https://github.com/m7md1alaa/school-folders-cli/"
  url "https://github.com/yourusername/education-folder-creator/archive/v1.0.0.tar.gz"
  sha256 "YOUR_TARBALL_SHA256"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    assert_match "1.0.0", shell_output("#{bin}/school-folder --version")
  end
end