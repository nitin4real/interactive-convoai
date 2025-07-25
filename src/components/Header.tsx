import React from 'react';
import agoraLogo from '../assets/agora_logo.png';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/auth.service';
const Header: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const brandDetails = authService.getBrandDetails();
  console.log(setTheme)
  return (
    <header
      className="w-full py-4 px-6 flex items-center justify-between shadow-md transition-colors duration-200 h-16"
      style={{
        backgroundColor: currentTheme.colors.header.background,
        color: currentTheme.colors.header.text
      }}
    >
      <div className="flex items-center gap-4">
        {/* only show brand logo if brandDetails is available */}
        {brandDetails && brandDetails.brandLogo && (
          <>
            <img src={brandDetails?.brandLogo} alt="Brand Logo" className="h-12 w-12 rounded bg-white p-1 shadow" />
            <span className="text-2xl font-bold tracking-wide">{brandDetails?.brandName}</span>
          </>
        )}
        <img src={agoraLogo} alt="Agora Logo" className="h-10 w-auto" />
        <span className="text-xl font-semibold ml-2 p-2">Powered by Agora</span>
      </div>

      <div className="flex items-center gap-6">
        <span className="font-medium text-lg hidden md:block">
          Interactive Learning Platform
        </span>

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Palette className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {themes.map((theme) => (
              <DropdownMenuItem
                key={theme.name}
                onClick={() => setTheme(theme)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <span>{theme.name}</span>
                {currentTheme.name === theme.name && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </header>
  );
};

export default Header; 