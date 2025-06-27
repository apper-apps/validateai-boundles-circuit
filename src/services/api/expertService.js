import { toast } from 'react-toastify';

class ExpertService {
  constructor() {
    this.tableName = 'expert';
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'contactInformation', 'domainExpertiseId', 'userId'
    ];
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "contactInformation" } },
          { 
            field: { Name: "domainExpertiseId" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "userId" } }
        ]
      };

      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching experts:", error);
      toast.error("Failed to fetch experts");
      throw error;
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "contactInformation" } },
          { 
            field: { Name: "domainExpertiseId" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "userId" } }
        ]
      };

      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching expert with ID ${id}:`, error);
      return null;
    }
  }

  async getByDomain(domainId) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "contactInformation" } },
          { 
            field: { Name: "domainExpertiseId" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "userId" } }
        ],
        where: [
          {
            FieldName: "domainExpertiseId",
            Operator: "EqualTo",
            Values: [parseInt(domainId)]
          }
        ]
      };

      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching experts for domain ID ${domainId}:`, error);
      toast.error("Failed to fetch experts for domain");
      return [];
    }
  }

  async create(item) {
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredItem = {};
      this.updateableFields.forEach(field => {
        if (item[field] !== undefined) {
          if (field === 'domainExpertiseId' && item[field]) {
            filteredItem[field] = parseInt(item[field]);
          } else {
            filteredItem[field] = item[field];
          }
        }
      });

      const params = {
        records: [filteredItem]
      };

      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating expert:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (data[field] !== undefined) {
          if (field === 'domainExpertiseId' && data[field]) {
            filteredData[field] = parseInt(data[field]);
          } else {
            filteredData[field] = data[field];
          }
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating expert:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const client = this.getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting expert:", error);
      throw error;
    }
  }
}

export const expertService = new ExpertService();