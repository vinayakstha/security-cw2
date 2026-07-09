"use client";

import { useState, useEffect } from "react";
import { Shield, ShieldOff, Smartphone, Check, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  setupTotp,
  verifyAndEnableTotp,
  disableTotp,
} from "@/lib/api/auth";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

interface TotpSetupProps {
  modal?: boolean;
  onSuccess?: () => void;
}

export default function TotpSetup({ modal, onSuccess }: TotpSetupProps) {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Setup state
  const [showSetup, setShowSetup] = useState(false);
  const [secret, setSecret] = useState("");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Disable state
  const [showDisable, setShowDisable] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [disabling, setDisabling] = useState(false);

  useEffect(() => {
    if (user) {
      setIsEnabled(user.totpEnabled || false);
    }
  }, [user]);

  const handleSetup = async () => {
    try {
      setLoading(true);
      const result = await setupTotp();
      if (result.success) {
        setSecret(result.data.secret);
        setOtpauthUrl(result.data.otpauthUrl);
        setShowSetup(true);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to setup TOTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndEnable = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    try {
      setVerifying(true);
      const result = await verifyAndEnableTotp(verificationCode, secret);
      if (result.success) {
        toast.success("TOTP enabled successfully");
        setIsEnabled(true);
        setShowSetup(false);
        setVerificationCode("");
        setSecret("");
        setOtpauthUrl("");
        onSuccess?.();
      }
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleDisable = async () => {
    if (!disablePassword) {
      toast.error("Please enter your password");
      return;
    }
    try {
      setDisabling(true);
      const result = await disableTotp(disablePassword);
      if (result.success) {
        toast.success("TOTP disabled successfully");
        setIsEnabled(false);
        setShowDisable(false);
        setDisablePassword("");
        onSuccess?.();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to disable TOTP");
    } finally {
      setDisabling(false);
    }
  };

  const content = (
    <>
      {showSetup ? (
        /* SETUP FLOW */
        <div className="space-y-6">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <Smartphone size={16} />
            <span>
              Scan the QR code below with your authenticator app (Google
              Authenticator, Authy, etc.)
            </span>
          </div>

          <div className="flex justify-center">
            <div className="p-4 bg-white border border-gray-200 rounded-xl">
              <QRCodeSVG value={otpauthUrl} size={180} />
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">
              Or manually enter this secret key:
            </p>
            <code className="text-sm font-mono bg-gray-100 px-3 py-1.5 rounded break-all select-all">
              {secret}
            </code>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Enter the 6-digit code from your authenticator app
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-center text-xl tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-[#006BAA]/30 focus:border-[#006BAA]"
                autoFocus
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowSetup(false);
                setSecret("");
                setOtpauthUrl("");
                setVerificationCode("");
              }}
              className="text-sm px-4 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifyAndEnable}
              disabled={verifying || verificationCode.length !== 6}
              className="flex items-center gap-1.5 text-sm bg-[#006BAA] text-white px-4 py-2 rounded-md hover:bg-[#01508d] disabled:opacity-60 transition"
            >
              {verifying ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {verifying ? "Verifying..." : "Verify & Enable"}
            </button>
          </div>
        </div>
      ) : showDisable ? (
        /* DISABLE CONFIRMATION */
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-700">
            <ShieldOff size={16} />
            <span>
              Disabling TOTP will make your account less secure. Please enter
              your password to confirm.
            </span>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDisable(false);
                setDisablePassword("");
              }}
              className="text-sm px-4 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDisable}
              disabled={disabling || !disablePassword}
              className="flex items-center gap-1.5 text-sm bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-60 transition"
            >
              {disabling ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ShieldOff size={14} />
              )}
              {disabling ? "Disabling..." : "Disable TOTP"}
            </button>
          </div>
        </div>
      ) : (
        /* DEFAULT STATE */
        <div className="space-y-4">
          {isEnabled ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check size={16} />
              <span>TOTP is currently enabled for your account.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield size={16} />
              <span>
                Enhance your account security with two-factor authentication.
              </span>
            </div>
          )}
          <button
            onClick={isEnabled ? () => setShowDisable(true) : handleSetup}
            className={`w-full flex items-center justify-center gap-1.5 text-sm px-3 py-2 rounded-md transition ${
              isEnabled
                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                : "bg-[#006BAA] text-white hover:bg-[#01508d]"
            }`}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isEnabled ? (
              <ShieldOff size={14} />
            ) : (
              <Shield size={14} />
            )}
            {loading ? "Loading..." : isEnabled ? "Disable" : "Enable"}
          </button>
        </div>
      )}
    </>
  );

  /* ===== Modal mode: just content, no wrapper ===== */
  if (modal) {
    return content;
  }

  /* ===== Standalone mode: full card with header ===== */
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-700">
            Two-Factor Authentication
          </h3>
        </div>
        {!showSetup && (
          <button
            onClick={isEnabled ? () => setShowDisable(true) : handleSetup}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md transition ${
              isEnabled
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-[#006BAA] text-white hover:bg-[#01508d]"
            }`}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isEnabled ? (
              <ShieldOff size={14} />
            ) : (
              <Shield size={14} />
            )}
            {loading ? "Loading..." : isEnabled ? "Disable" : "Enable"}
          </button>
        )}
      </div>

      <div className="px-4 md:px-6 py-4">{content}</div>
    </div>
  );
}
