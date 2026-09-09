import React from 'react'

export default function GeneralSettings(){
  return (
    <div className="space-y-6">
      <div>
        <h1 className="header-title">General Settings</h1>
        <p className="text-gray-600">Manage your organization's general settings and preferences.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Organization Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Allow public company profile</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Allow member profiles to be indexed by search engines</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Require profile completion before member activation</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Send profile updates notifications</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Send member activity digest</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 border rounded-lg">Cancel</button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">Save Settings</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">Plan Information</h3>
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-gray-600">Current Plan</div>
              <div className="font-semibold">Premium Plan</div>
            </div>
            <div className="border-t pt-4">
              <div className="text-gray-600">Members Limit</div>
              <div className="font-semibold">500</div>
            </div>
            <div className="border-t pt-4">
              <div className="text-gray-600">Storage</div>
              <div className="font-semibold">100 GB</div>
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg">Upgrade Plan</button>
          </div>
        </div>
      </div>
    </div>
  )
}
