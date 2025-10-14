#!/bin/bash
# Password Manager Setup Helper

echo "══════════════════════════════════════════"
echo "  🔐 Password Manager Setup"
echo "══════════════════════════════════════════"
echo ""

echo "This script will help you choose and set up a password manager."
echo ""

echo "📋 What you need to store:"
echo "  • OpenAI API Key (NEW)"
echo "  • Anthropic API Key (NEW)"
echo "  • Database credentials"
echo "  • Vercel tokens"
echo "  • Clerk keys"
echo ""

echo "🎯 Recommended Option: Bitwarden (Free)"
echo ""
echo "Why Bitwarden?"
echo "  ✅ Free forever (unlimited passwords)"
echo "  ✅ Open source & audited"
echo "  ✅ Works on all devices"
echo "  ✅ Zero-knowledge encryption"
echo "  ✅ Easy to use"
echo ""

read -p "Would you like to open the Bitwarden website? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  if command -v cmd.exe &> /dev/null; then
    # Windows
    cmd.exe /c start https://bitwarden.com/
  elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open https://bitwarden.com/
  elif command -v open &> /dev/null; then
    # Mac
    open https://bitwarden.com/
  else
    echo "Please open: https://bitwarden.com/"
  fi
fi

echo ""
echo "📖 Full setup guide available at:"
echo "   docs/security/PASSWORD_MANAGER_SETUP.md"
echo ""

echo "✅ Quick Setup Checklist:"
echo ""
echo "1. Go to https://bitwarden.com/"
echo "2. Click 'Get Started' → Create account"
echo "3. Choose a STRONG master password"
echo "4. WRITE DOWN your master password on paper!"
echo "5. Install desktop app or browser extension"
echo "6. Add your API keys as 'Secure Notes'"
echo ""

echo "📝 To store your API keys in Bitwarden:"
echo ""
echo "   Name: GalaxyCo - OpenAI API Key"
echo "   Type: Secure Note"
echo "   Content: Copy from apps/web/.env.local"
echo ""
echo "   Name: GalaxyCo - Anthropic API Key"
echo "   Type: Secure Note"
echo "   Content: Copy from apps/web/.env.local"
echo ""

echo "⚠️  IMPORTANT:"
echo "   • Your master password cannot be recovered"
echo "   • Write it down and store safely"
echo "   • Enable 2FA after initial setup"
echo ""

echo "Need help? Check docs/security/PASSWORD_MANAGER_SETUP.md"
echo ""
