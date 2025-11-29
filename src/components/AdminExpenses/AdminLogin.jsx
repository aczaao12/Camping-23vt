import React from 'react';

const AdminLogin = ({ passwordInput, setPasswordInput, handleLogin, authError }) => {
    return (
        <div className="min-h-screen pt-32 pb-10 px-4 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">🔒 Khu Vực Quản Trị</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none text-blue-700 font-bold"
                        placeholder="Mật khẩu..."
                        autoFocus
                    />
                    {authError && <p className="text-red-500 text-sm font-bold text-center">{authError}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
                    >
                        Truy Cập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
