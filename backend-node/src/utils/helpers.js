export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const paginate = (model) => async (query, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    populate = null,
    select = null
  } = options;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  let queryBuilder = model.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  if (populate) {
    queryBuilder = queryBuilder.populate(populate);
  }

  if (select) {
    queryBuilder = queryBuilder.select(select);
  }

  const [results, total] = await Promise.all([
    queryBuilder.exec(),
    model.countDocuments(query)
  ]);

  return {
    results,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
      hasNext: skip + results.length < total,
      hasPrev: page > 1
    }
  };
};

export const formatResponse = (success, message, data = null) => {
  const response = { success, message };
  if (data !== null) {
    response.data = data;
  }
  return response;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};
