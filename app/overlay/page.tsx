import OverlayComponent from '@/components/Overlay'

export default function OverlayPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <OverlayComponent>
        <div className="max-w-7xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Protected Overlay Content
            </h1>
            
            <div className="space-y-6 text-gray-700">
              <p className="text-lg">
                This is a demonstration of the protected overlay system. Only authenticated users 
                with proper roles can see this content.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">🔐 Secure Access</h3>
                  <p className="text-gray-700">
                    Role-based authentication ensures only authorized users can view this overlay.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">⚡ Real-time Verification</h3>
                  <p className="text-gray-700">
                    Access is verified in real-time on every page load for maximum security.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-purple-800 mb-3">🎨 Embeddable</h3>
                  <p className="text-gray-700">
                    This overlay can be embedded on any page with role-based restrictions.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-8">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">How to Use</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Login with valid credentials</li>
                  <li>Admin assigns appropriate roles in the admin panel</li>
                  <li>Users can access overlays based on their role permissions</li>
                  <li>Embed this component on any page for protected content</li>
                </ol>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Embed Code Example:</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`import OverlayComponent from '@/components/Overlay'

// Basic usage
<OverlayComponent>
  <YourContent />
</OverlayComponent>

// Require specific role
<OverlayComponent requireRole="ADMIN">
  <AdminOnlyContent />
</OverlayComponent>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </OverlayComponent>
    </div>
  )
}
