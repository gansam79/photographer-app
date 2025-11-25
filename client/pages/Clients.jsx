import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import ClientForm from "@/components/ClientForm";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Users } from "lucide-react";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedClient(null);
    setShowForm(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setShowForm(true);
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete client");
      fetchClients();
      toast.success("Client deleted successfully");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Error deleting client");
    }
  };

  const handleSave = (client) => {
    setShowForm(false);
    setSelectedClient(null);
    fetchClients();
    toast.success(
      selectedClient
        ? "Client updated successfully"
        : "Client added successfully",
    );
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getCategoryColor = (category) => {
    const colors = {
      Regular: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      VIP: "bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-200",
      "New Inquiry":
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[category] || colors["New Inquiry"];
  };

  return (
    <div className="min-h-screen bg-gold-50 dark:bg-charcoal-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="luxury-text-title mb-2">Clients</h1>
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-300">
              Manage your client database and relationships
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-montserrat font-medium rounded transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Client
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded font-montserrat text-charcoal-900 dark:text-white placeholder-charcoal-400"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block">
              <Users className="w-8 h-8 text-gold-500" />
            </div>
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400 mt-4">
              Loading clients...
            </p>
          </div>
        ) : filteredClients.length === 0 && searchTerm === "" ? (
          <div className="luxury-card text-center py-16">
            <Users className="w-16 h-16 text-gold-300 mx-auto mb-4" />
            <h2 className="luxury-text-subtitle text-xl mb-2">
              No Clients Yet
            </h2>
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400 mb-6">
              Start building your client database to track all your photography
              clients
            </p>
            <button
              onClick={handleAddNew}
              className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-montserrat font-medium rounded transition-colors inline-block"
            >
              Add Your First Client
            </button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="luxury-card text-center py-8">
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400">
              No clients found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredClients.map((client) => (
              <div
                key={client._id}
                className="luxury-card flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-playfair text-lg font-semibold text-charcoal-900 dark:text-white">
                      {client.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-montserrat font-medium ${getCategoryColor(
                        client.category,
                      )}`}
                    >
                      {client.category}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400">
                        {client.email}
                      </p>
                      <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400">
                        {client.phone}
                      </p>
                    </div>
                    <div>
                      <div className="flex gap-6">
                        <div>
                          <p className="font-montserrat text-xs text-charcoal-500 dark:text-charcoal-400">
                            Total Billed
                          </p>
                          <p className="font-montserrat font-semibold text-gold-600">
                            ₹{client.totalBilled?.toLocaleString() || "0"}
                          </p>
                        </div>
                        <div>
                          <p className="font-montserrat text-xs text-charcoal-500 dark:text-charcoal-400">
                            Pending
                          </p>
                          <p className="font-montserrat font-semibold text-red-600">
                            ₹{client.pendingAmount?.toLocaleString() || "0"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {client.tags && client.tags.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {client.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-700 dark:text-charcoal-200 text-xs rounded font-montserrat"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-2 hover:bg-gold-100 dark:hover:bg-charcoal-700 rounded transition-colors"
                    title="Edit client"
                  >
                    <Edit2 className="w-5 h-5 text-gold-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-charcoal-700 rounded transition-colors"
                    title="Delete client"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <ClientForm
          client={selectedClient}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
