import React from "react";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Github,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface FooterProps {
  companyName?: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };
}

const Footer = ({
  companyName = "PetConnect",
  logoUrl = "/vite.svg",
  contactEmail = "help@petconnect.com",
  contactPhone = "(555) 123-4567",
  address = "123 Pet Avenue, New York, NY 10001",
  socialLinks = {
    facebook: "https://facebook.com/petconnect",
    twitter: "https://twitter.com/petconnect",
    instagram: "https://instagram.com/petconnect",
    github: "https://github.com/petconnect",
  },
}: FooterProps) => {
  return (
    <footer className="w-full bg-white border-t py-8 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={logoUrl} alt={companyName} className="h-8 w-8" />
              <span className="text-xl font-bold">{companyName}</span>
            </div>
            <p className="text-sm text-gray-600">
              Helping reunite lost pets with their owners through AI technology
              and community engagement.
            </p>
            <div className="flex space-x-4">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Github"
                >
                  <Github className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/lost-pets"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Lost Pets
                </a>
              </li>
              <li>
                <a
                  href="/found-pets"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Found Pets
                </a>
              </li>
              <li>
                <a
                  href="/success-stories"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Success Stories
                </a>
              </li>
              <li>
                <a
                  href="/resources"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Pet Care Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-600 mr-2 mt-0.5" />
                <span className="text-gray-600">{address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-600 mr-2" />
                <a
                  href={`tel:${contactPhone.replace(/[^0-9]/g, "")}`}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-600 mr-2" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-600">
              Subscribe to our newsletter for updates on lost pets in your area.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} {companyName}. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/privacy"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/cookies"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Cookie Policy
            </a>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-sm text-gray-600 mr-2">Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-600 ml-2">
              for pets everywhere
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
