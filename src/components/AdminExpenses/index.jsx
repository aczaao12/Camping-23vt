import React from 'react';
import useAdminExpenses from './useAdminExpenses';
import AdminLogin from './AdminLogin';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

const AdminExpenses = () => {
    const {
        isAuthenticated,
        passwordInput,
        setPasswordInput,
        authError,
        handleLogin,
        formData,
        setFormData,
        handleChange,
        handleSubmit,
        isSubmitting,
        editingRowIndex,
        setEditingRowIndex,
        handleCancelEdit,
        status,
        setStatus,
        filteredList,
        isLoadingList,
        handleEdit,
        handleDelete,
        searchTerm,
        setSearchTerm,
        fetchDataList
    } = useAdminExpenses();

    if (!isAuthenticated) {
        return (
            <AdminLogin
                passwordInput={passwordInput}
                setPasswordInput={setPasswordInput}
                handleLogin={handleLogin}
                authError={authError}
            />
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-10 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Form - Sticky on Desktop */}
                <div className="lg:col-span-1 lg:sticky lg:top-24 z-10">
                    <ExpenseForm
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        editingRowIndex={editingRowIndex}
                        handleCancelEdit={handleCancelEdit}
                        status={status}
                        setEditingRowIndex={setEditingRowIndex}
                        setStatus={setStatus}
                        setSearchTerm={setSearchTerm}
                    />
                </div>

                {/* Right Column: Data List */}
                <div className="lg:col-span-2 w-full">
                    <ExpenseList
                        filteredList={filteredList}
                        isLoadingList={isLoadingList}
                        formData={formData}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        fetchDataList={fetchDataList}
                        editingRowIndex={editingRowIndex}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminExpenses;
